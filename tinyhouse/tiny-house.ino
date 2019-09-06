int DEBUG = 0;

// Define the pins we're going to call pinMode on
int NEXA_PUSH_ON = D0;  // You'll need to wire an LED to this one to see it blink.
int NEXA_PUSH_OFF = D1;  // You'll need to wire an LED to this one to see it blink.
// int ledBuiltIn = D7; // This one is the built-in tiny one to the right of the USB jack

int s_current_mode = -1; // 0=OFF, 1=ON, -1=UNKNOWN
int s_target_mode = -1; // 0=OFF, 1=ON, -1=AUTO
double s_current_temp = 0.0;
double s_last_temp = -999.0;
double s_target_temp = 18.0;
//int s_temp_direction = 0;
char s_state[255] = "";

// http://en.wikipedia.org/wiki/Hysteresis#Control_systems
#define TEMP_MARGIN 0.5


// PID
#include "pid/pid.h"
double Output;
PID myPID(&s_current_temp, &Output, &s_target_temp, 2,5,1, PID::DIRECT);
int WindowSize = 600000; // 10 min
unsigned long windowStartTime;


// This routine runs only once upon reset
void setup() {
    // Currently the application supports the creation of up to 4 different Spark functions; The length of the funcKey is limited to a max of 12 characters
    // curl -G https://api.spark.io/v1/devices/54ff6e066678574936530467/switch -d access_token=6cb03418b45a494c0a5e7f39d846f6371c2beb7f -d params=ON
    Spark.function("switch", doSwitchFunction);
    // Spark.function("identify", doIdentifyFunction);
    Spark.function("setTgtTemp", setTargetTempFunction); // exported for IFTTT & web
    Spark.function("setTgtMode", setTargetModeFunction); // exported for IFTTT & web

    // Currently, up to 10 Spark variables may be defined and each variable name is limited to a max of 12 characters
    // curl https://api.spark.io/v1/devices/54ff6e066678574936530467/currentTemp?access_token=6cb03418b45a494c0a5e7f39d846f6371c2beb7f
    Spark.variable("currentMode", &s_current_mode, INT);
    Spark.variable("targetMode", &s_target_mode, INT);
    Spark.variable("currentTemp", &s_current_temp, DOUBLE);
    Spark.variable("targetTemp", &s_target_temp, DOUBLE);
    Spark.variable("state", &s_state, STRING);


    // Connect the temperature sensor to A7 and configure it to be an input
    pinMode(A7, INPUT);

    pinMode(NEXA_PUSH_ON, OUTPUT);
    pinMode(NEXA_PUSH_OFF, OUTPUT);

    digitalWrite(NEXA_PUSH_ON, LOW);
    digitalWrite(NEXA_PUSH_OFF, LOW);

    // PID
    /*windowStartTime = millis();
    myPID.SetOutputLimits(60000, WindowSize);
    myPID.SetMode(PID::AUTOMATIC);*/
}


int doSwitchFunction(String command)
{
    if (DEBUG) {
        Spark.publish("doSwitchFunction", command, 60, PRIVATE);
    }

    if (! (command == "0" || command == "1")) {
        return 0;
    }

    int x = command.toInt();

    int pin = (x == 0) ? NEXA_PUSH_OFF : NEXA_PUSH_ON;

    digitalWrite(pin, HIGH);
    delay(500);
    digitalWrite(pin, LOW);

    s_current_mode = x;

    return 1;
}

// int doIdentifyFunction(String command)
// {
//     if (DEBUG) {
//         Spark.publish("doIdentifyFunction", command, 60, PRIVATE);
//     }

//     for (int i=0; i<2; i++) {
//         String x = (!s_current_mode ? "1" : "0");
//         doSwitchFunction(x);
//     }

//     return 1;
// }

int setTargetTempFunction(String command)
{
    if (DEBUG) {
        Spark.publish("setTargetTempFunction", command, 60, PRIVATE);
    }


    double x = command.toFloat();
    s_target_temp = x;

    return 1;
}

int setTargetModeFunction(String command)
{
    if (DEBUG) {
        Spark.publish("setTargetModeFunction", command, 60, PRIVATE);
    }

    if (! (command == "0" || command == "1" || command == "-1")) {
        return 0;
    }

    int x = command.toInt();
    s_target_mode = x;

    return 1;
}

void updateStateVariable()
{
    sprintf(s_state, "{ \"mode\":%d, \"tgtMode\":%d, \"temp\":%f, \"tgtTemp\":%f }", s_current_mode, s_target_mode, s_current_temp, s_target_temp);
}


double readTemperature()
{
    int reading = 0;
    double voltage = 0.0;
    // Keep reading the sensor value so when we make an API call to read its value, we have the latest one
    reading = analogRead(A7);
    // The returned value from the Core is going to be in the range from 0 to 4095
    // Calculate the voltage from the sensor reading
    voltage = (reading * 3.3) / 4095;
    // Calculate the temperature and update our static variable
    return ((voltage - 0.5) * 100);
}

#define PUBLISH_DELAY 30000

unsigned long s_last_published_millis = 0;

void publishTemperature()
{
    unsigned long now = millis();
    if ((now - s_last_published_millis) < PUBLISH_DELAY) {
        // it hasn't been 30 seconds yet...
        return;
    }
    Spark.publish("librato_temperature", String(s_current_temp), 60, PRIVATE);
    s_last_published_millis = now;
}


// This routine gets called repeatedly, like once every 5-15 milliseconds.
// Spark firmware interleaves background CPU activity associated with WiFi + Cloud activity with your code.
// Make sure none of your code delays or blocks for too long (like more than 5 seconds), or weird things can happen.
void loop() {
    double current_temp = readTemperature();

    // First run
    if (s_last_temp == -999.0) {
        s_last_temp = current_temp;
        s_current_temp = current_temp;
    }

    double delta = (current_temp - s_last_temp);

    // Discard obviously erroneous fluctuations
    if (abs(delta) > 1.0) {
        return;
    }

    s_last_temp = s_current_temp;
    s_current_temp = current_temp;

    publishTemperature();

    // PID
    myPID.Compute();

    if (millis() - windowStartTime>WindowSize) { //time to shift the Relay Window
        windowStartTime += WindowSize;
    }
    if (Output < millis() - windowStartTime) {
        if (s_current_mode == 0) { // heater is off
            doSwitchFunction("1"); // turn on
        }
    }
    else {
        if (s_current_mode == 1) { // heater is on
            doSwitchFunction("0"); // turn off
        }
    }
/*
    if (s_target_mode == -1) {
        if (s_current_mode != 0 && (s_current_temp >= (s_target_temp+TEMP_MARGIN))) { // heater is on && too hot
            doSwitchFunction("0"); // turn off
        }
        else if (s_current_mode != 1 && (s_current_temp <= (s_target_temp-TEMP_MARGIN))) { // heater is off && too cold
            doSwitchFunction("1"); // turn on
        }
    }
    else if (s_target_mode != s_current_mode) {
        doSwitchFunction((s_target_mode == 1) ? "1" : "0");
    }*/

    updateStateVariable();

    if (DEBUG) {
        Spark.publish("state", s_state, 60, PRIVATE);
    }
}

// Define the pins we're going to call pinMode on
#define NEXA_PUSH_ON D0  // You'll need to wire an LED to this one to see it blink.
#define NEXA_PUSH_OFF D1  // You'll need to wire an LED to this one to see it blink.

int s_current_mode = -1; // 0=OFF, 1=ON, -1=UNKNOWN
int s_target_mode = -1; // 0=OFF, 1=ON, -1=AUTO
double s_current_temp = 0.0;
double s_target_temp = 7;
double s_last_temp = -999.0;
double s_last_switch_millis = 0;

char s_state[255] = "";


// http://en.wikipedia.org/wiki/Hysteresis#Control_systems
#define TEMP_MARGIN 0.25
#define LAST_SWITCH_MILLIS (1000*60*30)


// This routine runs only once upon reset
void setup() {
    // Currently the application supports the creation of up to 4 different Particle functions; The length of the funcKey is limited to a max of 12 characters
    // curl -G https://api.particle.io/v1/devices/54ff6e066678574936530467/switch -d access_token=ACCESS_TOKEN -d params=ON
    Particle.function("switch", doSwitchFunction);
    Particle.function("setTgtTemp", setTgtTempFunction);
    Particle.function("setTgtMode", setTgtModeFunction);

    // Currently, up to 10 Particle variables may be defined and each variable name is limited to a max of 12 characters
    // curl https://api.particle.io/v1/devices/54ff6e066678574936530467/currentTemp?access_token=ACCESS_TOKEN
    Particle.variable("currentMode", s_current_mode);
    Particle.variable("targetMode", s_target_mode);
    Particle.variable("currentTemp", s_current_temp);
    Particle.variable("targetTemp", s_target_temp);
    Particle.variable("state", s_state);

    // Connect the temperature sensor to A7 and configure it to be an input
    pinMode(A7, INPUT);

    pinMode(NEXA_PUSH_ON, OUTPUT);
    pinMode(NEXA_PUSH_OFF, OUTPUT);

    digitalWrite(NEXA_PUSH_ON, LOW);
    digitalWrite(NEXA_PUSH_OFF, LOW);

    // take control of the RGB LED
    RGB.control(true);
    // Scale the RGB LED brightness to 25%
    RGB.brightness(0);    
}


int doSwitchFunction(String command)
{
    Particle.publish("doSwitchFunction", command, 60, PRIVATE);

    if (! (command == "0" || command == "1")) {
        return 0;
    }
    
    int x = command.toInt();
    
    int pin = (x == 0) ? NEXA_PUSH_OFF : NEXA_PUSH_ON;
        
    digitalWrite(pin, HIGH);
    delay(500);
    digitalWrite(pin, LOW);
    
    s_last_switch_millis = millis();
    s_current_mode = x;

    return 1;
}


int setTgtTempFunction(String value)
{
    Particle.publish("setTgtTemp", value, PRIVATE);

    double x = value.toFloat();
    if (x < 5) {
        x = 5;
    }
    s_target_temp = x;

    return 1;
}

int setTgtModeFunction(String value)
{
    Particle.publish("setTgtMode", value, PRIVATE);

    if (! (value == "0" || value == "1" || value == "-1")) {
        return 0;
    }
    
    int x = value.toInt();
    s_target_mode = x;

    return 1;
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


#define PUBLISH_DELAY 60*1000

unsigned long s_last_published_millis = 0;

void publishTemperature()
{
    unsigned long now = millis();
    if ((now - s_last_published_millis) < PUBLISH_DELAY) {
        // it hasn't been 60 seconds yet...
        return;
    }
    Particle.publish("temperature", String(s_current_temp), PRIVATE);
    s_last_published_millis = now;
}

// This routine gets called repeatedly, like once every 5-15 milliseconds.
// Particle firmware interleaves background CPU activity associated with WiFi + Cloud activity with your code. 
// Make sure none of your code delays or blocks for too long (like more than 5 seconds), or weird things can happen.
void loop() {
    s_current_temp = readTemperature();

    // First run
    if (s_last_temp == -999.0) {
        s_last_temp = s_current_temp;
    }
    
    double delta = (s_current_temp - s_last_temp);
        
    // Discard obviously erroneous fluctuations
    if (abs(delta) > 1.0) {
        return;
    }

    s_last_temp = s_current_temp;

    publishTemperature();

    if (s_target_mode == -1) {
        if (s_current_temp >= (s_target_temp+TEMP_MARGIN)) { // too hot
            if ((s_current_mode != 0) || (millis() - s_last_switch_millis > LAST_SWITCH_MILLIS))
                doSwitchFunction("0"); // turn off
        }
        else if (s_current_temp <= (s_target_temp-TEMP_MARGIN)) { // too cold
            if ((s_current_mode != 1) || (millis() - s_last_switch_millis > LAST_SWITCH_MILLIS))
                doSwitchFunction("1"); // turn on
        }
    }
    else if (s_target_mode != s_current_mode) {
        doSwitchFunction((s_target_mode == 1) ? "1" : "0");
    }

    sprintf(s_state, "{ \"mode\":%d, \"tgtMode\":%d, \"temp\":%f, \"tgtTemp\":%f }", s_current_mode, s_target_mode, s_current_temp, s_target_temp);
}

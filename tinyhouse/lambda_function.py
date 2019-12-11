import json
import http.client


def get_and_post_temp(lat, lon, feed_id):
    conn = http.client.HTTPSConnection("api.darksky.net")
    conn.request(
        "GET",
        f"/forecast/dff7cdcf89c569e47b734dd94db91741/{lat},{lon}?units=si&exclude=minutely,hourly,daily,alerts,flags",
    )
    r = conn.getresponse()
    print(r.status, r.reason)
    data = r.read()
    obj = json.loads(data)
    conn.close()

    conn = http.client.HTTPSConnection("io.adafruit.com")
    foo = {
        "value": obj["currently"]["temperature"],
        "lat": obj["latitude"],
        "lon": obj["longitude"],
    }
    headers = {"Content-type": "application/json"}
    conn.request(
        "POST", f"/api/v2/webhooks/feed/{feed_id}", json.dumps(foo), headers,
    )

    return obj


def lambda_handler(event, context):
    # TH
    obj = get_and_post_temp("59.270599", "18.593312", "PPCMmi4ZzB9GKqCTMK56D6eXmCQT")
    # F13
    obj = get_and_post_temp("59.343700", "18.036763", "4cJrJmEFdoNSyyCzPodBwrL3rwPd")
    return {"statusCode": 200, "body": obj}

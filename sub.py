import sys, time
import paho.mqtt.client as paho
import requests as requests

DEBUG_ON = True

clientId = "user487"
broker = "mqtt.emrys.cymru"
pubTopic = "response"
subTopic = "request"
retry = 5
delay = 2
counter = 0

client = False

def on_connect(client, obj, flags, rc):
    """ function called when connection is made to mqtt server 
    
    Attributes:
        client -- the instance of the mqtt client that connected
        obj -- the private user data as set in Client() or user_data_set()
        flags -- response flags sent by the broker (dict) 
        rc -- response code
    
    """
    global counter, retry, delay
    debug("Connected. Code: " + str(rc))
    if rc == 0:
        debug("Connection Accepted")
        counter = 0
        debug("Subscribing to ", subTopic)
        client.subscribe(subTopic) #subscribe
    else:
        debug("Error: %s" % rc in error_codes)
        if counter < retry:
            debug("Reconnecting...")
            debug("Waiting %s before retry" % delay)
            time.sleep(delay)
            connect()
        else:
            client.disconnect()


def on_message(client, obj, msg):
    """ function called when message is returend from the server 
    
    Attributes:
        client -- the instance of the mqtt client that received the message
        obj -- the private user data as set in Client() or user_data_set()
        msg - an instance of MQTTMessage. This is a class with members topic, payload, qos, retain
    
    """
    debug(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    call_api(msg)
    pass

def on_publish(client, obj, mid):
    """ function called when message is returend from the server 
    
    Attributes:
        client -- the instance of the mqtt client that published
        obj -- the private user data as set in Client() or user_data_set()
        mid -- message identifier
    
    """
    debug("Message ID: " + str(mid))
    pass

def on_subscribe(client, obj, mid, granted_qos):
    """ function called when the broker has acknowledged the subscription 
    
    Attributes:
        client -- the instance of the mqtt client that subscribed
        obj -- the private user data as set in Client() or user_data_set()
        mid -- message identifier
        granted_qos -- list of integers that give the QoS level the broker has granted
    
    """
    debug("Subscribed: %s %s" % str(mid), str(granted_qos))

def on_disconnect(client, userdata,rc=0):
    """ function called when the client disconnects from the broker

    Attributes
        client -- the instance of the mqtt client that disconnected
        userdata -- the private user data as set in Client() or user_data_set()
        rc -- the disconnection result. if called by disconnect() rc = 0 MQTT_ERR_SUCCESS

    """
    global counter, delay
    debug("Disconnected (%s)" % counter)
    if counter < retry:
        debug("Reconnecting...")
        debug("Waiting %s before retry" % delay)
        time.sleep(delay)
        connect()
    else:
        client.loop_stop()
        debug("Write to error log")
        exit()
###

def call_api(msg):
    """ Relay the message payload as an API call on the local emonCMS

    Attributes
        msg -- the response body from the ajax request

    """
    debug("Sending API call")
    request = msg.payload.decode("utf-8")
    r = requests.get(request)
    send_response(r.json())

def send_response(response):
    """ Forward the API call response (JSON) to another 
    MQTT topic the opposite client is subscibed to
    
    Attributes
        response -- json payload for the mqtt message
    
    """
    print(response.json())
    debug("Publishing API response to %s" % pubTopic)
    pub_response = client.publish(pubTopic, response.json()) #publish
    pub_response.wait_for_publish()

def connect():
    """ initial connection method """
    global counter
    debug("Attempt %s" % counter)
    counter += 1
    client.connect(broker, 1883, 60) #connect


def initialize():
    """ init function with exception handling """
    global client, clientId, DEBUG_ON
    try:
        if DEBUG_ON:
            debug('Start...')

        client = paho.Client(clientId) 
        client.on_connect = on_connect
        client.on_message = on_message
        client.on_publish = on_publish
        client.on_subscribe = on_subscribe
        client.on_disconnect = on_disconnect

        debug("Started loop...")
        client.loop_forever()

        debug("Connecting to: %s " % broker)
        connect()

    except TypeError:
        debug('Error creating connection.')
        return 

    except ValueError as err:
        debug("%s: %s" % err.name, err.args)
        return 

    except Exception as inst:
        print("Unexpected error:", sys.exc_info()[0])
        print(inst.args)
        raise

    finally:
        client.loop_stop()
        debug("Exit\n")
        return 

#####


def debug(msg):
    """ print error messages if DEBUG_ON == true """
    global DEBUG_ON
    if DEBUG_ON:
        print(msg)


"""
    pre defined paho mqtt server response codes
"""
error_codes = {
    0: "Connection Accepted",
    1: "Connection Refused, unacceptable protocol version",
    2: "Connection Refused, identifier rejected",
    3: "Connection Refused, Server unavailable",
    4: "Connection Refused, bad user name or password",
    5: "Connection Refused, not authorized",
}


initialize()
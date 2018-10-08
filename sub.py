import sys, time, logging, json
import paho.mqtt.client as paho
import requests as requests

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.INFO)

clientId = "user487"
broker = "mqtt.emrys.cymru"
pubTopic = "response"
subTopic = "request"
retry = 5
delay = 2
counter = 0
client = None

logging.debug("Settings: %s, %s, %s, %s", clientId, broker, pubTopic, subTopic)

def on_connect(client, obj, flags, rc):
    """ function called when connection is made to mqtt server 
    
    Attributes:
        client -- the instance of the mqtt client that connected
        obj -- the private user data as set in Client() or user_data_set()
        flags -- response flags sent by the broker (dict) 
        rc -- response code
    
    """
    global counter, retry, delay
    logging.info("Connected...")
    logging.debug(paho.connack_string(rc))

    if rc == 0:
        counter = 0
        logging.debug("Subscribing to \"%s\"", subTopic)
        client.subscribe(subTopic) #subscribe
    else:
        if counter < retry:
            logging.debug("Reconnecting...")
            logging.debug("Waiting %s before retry" % delay)
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
    logging.debug(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    call_api(msg)
    pass

def on_publish(client, obj, mid):
    """ function called when message is returend from the server 
    
    Attributes:
        client -- the instance of the mqtt client that published
        obj -- the private user data as set in Client() or user_data_set()
        mid -- message identifier
    
    """
    logging.debug("Message ID: " + str(mid))
    pass

def on_subscribe(client, obj, mid, granted_qos):
    """ function called when the broker has acknowledged the subscription 
    
    Attributes:
        client -- the instance of the mqtt client that subscribed
        obj -- the private user data as set in Client() or user_data_set()
        mid -- message identifier
        granted_qos -- list of integers that give the QoS level the broker has granted
    
    """
    logging.debug("Subscribed: %s %s" % str(mid), str(granted_qos))

def on_disconnect(client, userdata,rc=0):
    """ function called when the client disconnects from the broker

    Attributes
        client -- the instance of the mqtt client that disconnected
        userdata -- the private user data as set in Client() or user_data_set()
        rc -- the disconnection result. if called by disconnect() rc = 0 MQTT_ERR_SUCCESS

    """
    global counter, delay
    logging.debug("Disconnected (%s)" % counter)
    if counter < retry:
        logging.info("Reconnecting...")
        logging.debug("Waiting %s before retry" % delay)
        time.sleep(delay)
        connect()
    else:
        client.loop_stop()
        logging.debug("Write to error log")
        exit()
###

def call_api(msg):
    """ Relay the message payload as an API call on the local emonCMS

    Attributes
        msg -- the response body from the ajax request

    """
    logging.debug("Sending API call")
    request = msg.payload.decode("utf-8")
    send_response(requests.get(request))

def send_response(response):
    """ Forward the API call response (JSON) to another 
    MQTT topic the opposite client is subscibed to
    
    Attributes
        response -- json payload for the mqtt message
    
    """
    # print(response.json())
    logging.debug("Sending API response to: \"%s\"" % pubTopic)
    pub_response = client.publish(pubTopic, json.dumps(response.json())) #publish
    logging.debug("PUBLISHED: %s", paho.error_string(pub_response.rc))
    # pub_response.wait_for_publish()

def connect():
    """ calls the mqtt client connection method 
        
        counts number of connection attempts
    """
    global counter
    logging.debug("Attempt %s" % counter)
    counter += 1
    client.connect(broker, 1883, 60) #connect


def initialize():
    """ init function with exception handling.
    client.loop_forever() keeps looping this code until stop_loop() called
    
    """
    global client, clientId
    try:
        logging.info("\nStart...")

        client = paho.Client(clientId) 
        client.on_connect = on_connect
        client.on_message = on_message
        client.on_publish = on_publish
        client.on_subscribe = on_subscribe
        client.on_disconnect = on_disconnect

        logging.info("Connecting to: %s " % broker)
        connect()
        
        logging.debug("Started loop...")
        client.loop_forever()

    except TypeError:
        logging.debug('Error creating connection.')
        return 

    except ValueError as err:
        logging.debug("%s: %s" % err.name, err.args)
        return 

    except Exception as inst:
        logging.debug("Unexpected error:", sys.exc_info()[0])
        logging.debug(inst.args)
        raise

    finally:
        client.loop_stop()
        logging.info("Exit\n")
        return 

#####


initialize()
#!/usr/bin/env python3
import json
import logging
import sys
import time
import ssl

import requests as requests

import paho.mqtt.client as paho

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

clientId = "pythonClient"
host = "mqtt.emoncms.org"
username = "emrys"
password = "emrys"
port = 8883
pubTopic = "user/emrys/response"
subTopic = "user/emrys/request"
retry = 5
delay = 2
counter = 0
client = None
tls = True

logging.debug("Settings: %s, %s, %s, %s. TLS:%s", clientId, host, pubTopic, subTopic, tls)

def initialize():
    """ init function with exception handling.
    client.loop_forever() keeps looping this code until stop_loop() called

    """
    global client, clientId, delay
    try:
        logging.info("\nStart...")

        client = paho.Client(clientId)
        
        logging.info("registering callbacks")
        client.on_connect    = on_connect
        client.on_message    = on_message
        client.on_publish    = on_publish
        client.on_subscribe  = on_subscribe
        client.on_disconnect = on_disconnect

        logging.info("Connecting to: %s " % host)
        
        connect()
        client.loop_forever(timeout=delay)        

    except TypeError as err:
        logging.debug('Error creating connection. %s' % err)
        return

    except ValueError as err:
        logging.debug("%s: %s" % err, err.args)
        return

    except Exception as inst:
        logging.debug("Error: %s. %s", inst.args[0], inst.args[1])
        raise

    except: # catch *all* exceptions
        e = sys.exc_info()[0]
        logging.debug("Error: %s" % e)

    finally:
        client.loop_stop()
        logging.info("Exit\n")
        return

#####


def on_connect(client, obj, flags, rc):
    logging.info("on_connect()")

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
        client.subscribe(subTopic)  # subscribe
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
    logging.debug("Subscribed: messageid: %s,  QoS: %s" % (str(mid), str(granted_qos)))


def on_disconnect(client, userdata, rc=0):
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
    pub_response = client.publish(
        pubTopic, json.dumps(response.json()))  # publish
    logging.debug("PUBLISHED: %s", paho.error_string(pub_response.rc))
    # pub_response.wait_for_publish()

def setTLS(tls_version=None):
    if not hasattr(ssl, 'SSLContext'):
        # Require Python version that has SSL context support in standard library
        raise ValueError('Python 2.7.9 and 3.2 are the minimum supported versions for TLS.')

    # Create SSLContext object
    if tls_version is None:
        tls_version = ssl.PROTOCOL_TLSv1
        # If the python version supports it, use highest TLS version automatically
        if hasattr(ssl, "PROTOCOL_TLS"):
            tls_version = ssl.PROTOCOL_TLS

    context = ssl.SSLContext(tls_version)

    logging.info('-- SETTING TLS settings')
    
    client.tls_set(ca_certs="/usr/share/ca-certificates/mozilla/DST_Root_CA_X3.crt")
    # client.tls_set(ca_certs="/home/emrys/tmp/mqtt/certs/mqtt.emoncms.org")
    # client.tls_set(ca_certs="/home/emrys/tmp/mqtt/certs/mqtt.emoncms.org/fullchain.pem")
    client.tls_insecure_set(True)
    
    # @todo get this cert to work!

    # client.tls_set(ca_certs=None,certfile="/home/emrys/.ssh/mqtt/m2mqtt_ca.crt",keyfile=None,cert_reqs=ssl.CERT_NONE,tls_version=ssl.PROTOCOL_TLSv1)

def connect():
    """ calls the mqtt client connection method 

        counts number of connection attempts
    """
    global client, counter, host, port, username, password, tls
    client.enable_logger(logger=logging)

    if tls:
        context = setTLS()

    logging.debug("Attempt %s" % counter)
    counter += 1
    client.username_pw_set(username, password)
    client.connect(host, port, 60)  # connect




initialize()

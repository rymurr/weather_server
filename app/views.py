from flask import request,jsonify
from app import app
from pymongo import Connection
import pandas
import time
import datetime


client = Connection('192.168.0.101')
@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

@app.route('/api/v1.0/meteo/measurement/_find', methods = ['GET'])
def get_measurements():
    db = client.meteo
    coll = db['measurement']
    print convert_timestamp_helper(dict(request.args))
    results = pandas.DataFrame(list(coll.find()))
    results['timestamp'] = results.timestamp.map(lambda x:time.mktime(x.utctimetuple()) + x.microsecond*1E-6)
    return jsonify({'items':results.drop(['_id'], axis=1).T.to_dict().values()})


def convert_timestamp_helper(query):
    if 'timestamp' not in query:
        return query
    ok, ov = zip(*query['timestamp'].items())
    nv = map(datetime.datetime.utcfromtimestamp,ov)
    new_timestamps = dict(zip(ok, nv))
    query['timestamp'] = new_timestamps
    return query

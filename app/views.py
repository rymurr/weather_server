from flask import request,jsonify
from app import app
from pymongo import Connection, DESCENDING
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
    args = convert_query_helper(dict(request.args))
    results = convert_for_json(list(coll.find(args)))
    return jsonify(results)

@app.route('/api/v1.0/meteo/measurement/_last', methods=['GET'])
def get_last():
    db = client.meteo
    coll = db['measurement']
    items = []
    devices = set()
    for device in coll.distinct('device'):
        devices.add(device)
        for sensor in coll.distinct('sensor'):
            cursor = coll.find({'device':device,'sensor':sensor}, sort=[('_id',DESCENDING)], limit=1)
            if cursor.count() > 0:
                items.append(cursor.next())
    return jsonify(convert_for_json_last(items, devices))                

def convert_for_json_last(items, devices):
    df = pandas.DataFrame(items)
    df = df.drop(['_id'], axis=1)
    df['timestamp'] = df.timestamp.map(lambda x:time.mktime(x.utctimetuple()) + x.microsecond*1E-6)
    df = df.set_index(['device','timestamp','sensor']).unstack(-1).sort_index().fillna(method='ffill')
    retvals = []
    for device in list(devices):
        dnext = {}
        nextval = df.ix[device].ix[-1].ix['value']
        dnext['device'] = device
        dnext['timestamp'] = nextval.name
        dnext['values'] = nextval.to_dict()
        retvals.append(dnext)
    return {'items':dnext}

def convert_for_json(items):
    df = pandas.DataFrame(items)
    df['timestamp'] = df.timestamp.map(lambda x:time.mktime(x.utctimetuple()) + x.microsecond*1E-6)
    items = df.drop(['_id'], axis=1).T
    print items.index
    return {'items':items.to_dict().values(), 'cols':items.index.values.tolist()}


def convert_query_helper(query):
    for k,v in query.items():
        if type(v) == list:
            query[k] = v[0]
    return convert_timestamp_helper(query)        

def convert_timestamp_helper(query):
    tsq = {}
    if 'timestamp_lb' in query:
        tsq["$gte"] = datetime.datetime.utcfromtimestamp(float(query['timestamp_lb'])) 
        del query['timestamp_lb']
    if 'timestamp_ub' in query:
        tsq["$lte"] = datetime.datetime.utcfromtimestamp(float(query['timestamp_ub']))
        del query['timestamp_ub']
    if tsq:
        query['timestamp'] = tsq
    return query

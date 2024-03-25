from flask import render_template, request, redirect
from app import app
from app.loadexamples import Examples
from collections import defaultdict
import json
import random
import os


global examples 
examples = Examples()

global conditions
conditions = defaultdict(int)

global usermaps
usermaps = defaultdict(str)

@app.route("/")
@app.route("/index")
def hello():
    # return render_template("index.html", title="home")
    return redirect("/main")

def loadUsers():
    print('loading usermaps.txt')
    #if usermaps has been created and exists then upload the user data to keep track of conditions
    if os.path.getsize('usermaps.txt') > 0:
        #read the file
        file = ""
        with open("usermaps.txt", "r") as f:
            file = json.loads(f.read())
        #set conditions and existing user
        #reset counts to make sure we're not over counting
        cond = defaultdict(int)
        for user in file:
            usermaps[user['id']] = user['condition']
            cond[user['condition']] +=1
        global conditions
        conditions = cond
        return True
    return False

@app.route("/main")
def main():
    id="logs"
    return render_template("main.html", data = {"id":id})

@app.route("/scratch/<filename>/")
def scratch(filename):
    image = examples.getImage(filename)
    return render_template("scratch.html", image = image.__dict__)

@app.route('/submit', methods=["GET"]) #don't know why removing this causes the entire thing to just break
def submit():
    return None

@app.route('/tags', methods=["GET"])
def tags():
    if request.method == "GET":
        tags = dict.fromkeys(examples.getAllTags())
        return json.dumps(tags)
    return json.dumps({'success':False}), 400, {'ContentType':'application/json'} 

@app.route('/examples', methods=["GET", "POST"])
def getExamples():
    if request.method == "POST":
        data = request.json
        if data['tags'] == 'all':
            images = examples.getAllImages()
            return json.dumps(images)
        images = examples.getImages(data['tags'])
        
        return json.dumps(images)
    return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

@app.route('/log', methods=['POST', 'GET'])
def log():
    # if request.method == "POST":
        # data = request.json
        # file =""
        # # # print(data['log'])
        # with open("app/logs/"+"logs.txt", "r") as f:
        #     file = json.loads(f.read())
        #     file.append(data['log'])
        # with open("app/logs/"+str(data['id'])+".txt", "w") as f:
        #     f.write(json.dumps(file))
        # return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    # return json.dumps({'success':False}), 400, {'ContentType':'application/json'} 
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
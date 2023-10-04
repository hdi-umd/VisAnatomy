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

@app.route("/task")
def task():
    # randomize participant among four conditions. generate a random identifier for their logs
    # availconditions = ['1a', '1b', '2a', '2b']
    condition  = '1a' #comment this out if deploying on server.

    #check usermaps.txt was loaded
    # loadedFile = loadUsers()
    # if loadedFile:
    #     print('usermaps.txt successfully loaded...')
    # else:
    #     print('Unable to load usermaps.txt...')
    # condition =''
    # assigned = False
    # while not assigned:
    #     condition = random.SystemRandom().choice(availconditions)
    #     if conditions[condition] < 8: #TODO: replace with 8 after pilot is complete
    #         conditions[condition]+=1
    #         assigned = True
    id = int(random.randint(1000,9999))
    usermaps[id] = condition
    dd = {"id": id, "condition": condition}
    print(dd)
    print(conditions)
    # data = ''
    # if loadedFile:
    #     with open('usermaps.txt', "r") as f:
    #         data = json.loads(f.read())
    #         data.append(dd)
    # else:
    data =[dd,]

    with open('usermaps.txt', 'w') as f:
            f.write(json.dumps(data))
    with open("app/logs/"+str(id)+".txt", "w") as f:
        d = [dd,]
        f.write(json.dumps(d))
    return render_template("task.html", data = {"condition":condition, "id":id})

@app.route("/main")
def main():
    id="logs"
    return render_template("main.html", data = {"id":id})

@app.route("/scratch/<filename>/")
def scratch(filename):
    image = examples.getImage(filename)
    return render_template("scratch.html", image = image.__dict__)

@app.route("/demo/<int:id>/<condition>/")
def demo(id, condition):
    return render_template("demo.html", data = {"condition":condition, "id":id})

@app.route('/submit')
def submit():
    return render_template("end.html")

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
    if request.method == "POST":
        data = request.json
        file =""
        # # print(data['log'])
        with open("app/logs/"+"logs.txt", "r") as f:
            file = json.loads(f.read())
            file.append(data['log'])
        with open("app/logs/"+str(data['id'])+".txt", "w") as f:
            f.write(json.dumps(file))
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    return json.dumps({'success':False}), 400, {'ContentType':'application/json'} 
'use strict';

function Play(){
    this.resDisplay = null;
    this.resStorage = null;


    this.drones = [];
    this.factorys = [];
}

Play.prototype = {
    preload: function(){
        this.game.load.image('bg', 'assets/bg.png');
        this.game.load.image('spacer', 'assets/drone.png');
        this.game.load.image('dronex1', 'assets/dronex1.png');

        this.game.load.image('factory', 'assets/factory.png');
        this.game.load.image('fab1', 'assets/fab1.png');
        this.game.load.image('hub', 'assets/hub.png');
        this.game.load.image('workshop', 'assets/workshop.png');
        this.game.load.image('crystal', 'assets/crystal.png');
        this.game.load.image('farm1', 'assets/farm1.png');

        this.game.load.image('hubBody', 'assets/main.png');
        this.game.load.spritesheet('hubRing', 'assets/ring.png',128,128);
        this.game.load.spritesheet('hubOver', 'assets/ringalpha.png',128, 128);

        this.game.load.spritesheet('fab1anim', 'assets/fab1anim.png', 128, 128);
        this.selectedUnit = null;
    },

    create: function(){
        this.resDisplay = new ResourceDisplay(game);
        this.resStorage = new ResourceStorage();

        //world setup
        this.game.world.setBounds(0, 0, 2048, 2048); //2000x2000
        this.land = this.game.add.tileSprite(0, 0, 2048, 2048, 'bg');
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.land.fixedToCamera = true;

        //set start resources
        this.resStorage.resource1 = 0;
        this.resStorage.resource2 = 0;
        this.resStorage.resource3 = 0;

        this.resDisplay.create(this.resStorage);



        //this.massDroneCreate();
        this.testDrone = new Drone(50, 50, this.game);
        this.testDrone2 = new Drone(50, 50, this.game);
        this.testDrone3 = new Drone(50, 50, this.game);

        this.loadTestDrone = new Drone(100, 400, this.game);
        this.loadTestDrone.energy = 25;

        /*this.factorys.push(new Factory(600, 600, this.game, "hub"));
        this.factorys.push(new Factory(400, 600, this.game, "factory"));
        this.factorys.push(new Factory(200, 100, this.game, "workshop"));*/

        this.testFactory = new Factory(500,500,100,100,256, this.game, "fab1anim");
        this.testFactory.assignWorker(this.testDrone);
        this.testFactory.assignWorker(this.testDrone2);
        this.testFactory.assignWorker(this.testDrone3);

        this.testDrone.sprite.bringToTop();

        this.testDrone2.sprite.bringToTop();

        this.testDrone3.sprite.bringToTop();
       

        this.testHub = new Hub(1000, 300, this.game);
        //this.testHub.assignWorker(this.loadTestDrone);
    },


    update: function(){
        var game = this.game;
        this.resStorage.resource1 +=1; //remove
        this.resStorage.resource2 +=2; //remove
        this.resDisplay.update();

        var factorys = this.factorys;

        this.massDroneUpdate();
        this.factorys.forEach(
            function(factory){
                factory.tick();
            }
        );

        this.testDrone.tick();
        this.testDrone2.tick();
        this.testDrone3.tick();
        this.testFactory.tick();
        this.testHub.tick();
        this.loadTestDrone.tick();


        //Objekte auswählen geht so:
        //getObjectsUnderPointer(pointer, group, callback, callbackContext)
        //if (Phaser.Rectangle.contains(seat.body, passenger.x, passenger.y))

        if (this.game.input.activePointer.isDown) {
            if (this.game.origDragPoint) {

                this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
                this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;

                //this.drones[0].move(this.game.input.activePointer.position.x,this.game.input.activePointer.position.y);
            }
            //first tick, save current location
            this.game.origDragPoint = this.game.input.activePointer.position.clone();
        }
        else {
            this.game.origDragPoint = null;
        }

    },

    massDroneCreate : function () {
        for(var i = 0; i < 1000; i++){
            this.drones.push(new Drone(10, 10, this.game));

        }
    },

     massDroneUpdate: function () {
         this.drones.forEach(
             function(drone){
                 if(drone.status === 'idle'){
                     var x = Math.floor(Math.random() * 2000);
                     var y = Math.floor(Math.random() * 2000);

                     drone.move(x,y, function(){
                         drone.status = 'idle';
                     });
                     drone.status = 'moving';
                 }
                 drone.tick();

             }
         );
     }
};

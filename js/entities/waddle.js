/* Load Sprite */
compiling.sheet.push({
    "png_path": "waddle.png",
    "json_path": "waddle.json"
});

/* Animations */
Q.animations("waddle", {
    idle: {
        frames: [0,1],
        rate: 1/ 3,
        collision_box: {
            width: 32,
            height: 32,
        }
    },
    die:{
        frames: [2,3,4],
        rate:1 / 10,
        collision_box: {
            width: 32,
            height: 32,
        },
    },
    attack:{
        frames: [1,3],
        rate:1 / 10,
        collision_box: {
            width: 32,
            height: 32,
        },
    }
});

/* Object */

const WADDLE_STATE = {
    IDLE: 0,
    ATTACK: 1,
    DIE: -1,
};

Q.Sprite.extend("Waddle", {
    
    init: function(p){
       
        this._super(p, {
            sheet: "waddle",
            sprite: "waddle",
            isStatue: false,
            direction: "right",
            skipCollision: false,
            gravity: 1,
        });

        this.state = WADDLE_STATE.IDLE;
        this.flipActual=false;
        // primer ataque
        this.firstAttack = true;
        this.terminateAttack = false;
        //times
        this.dieTime = 0;
        this.attackTime = 0;
        this.endAttackTime = 0;

        this.add("Entity, aiBounce");

        /* Events */


        this.on("attack", this, "attack");
        this.on("bump", this, "collision");

    },

    collision: function(collision){
        if(collision.obj.isA("Kirby")){
            console.log("choco");
            this.attackTime=0;
            if(collision.obj.state === KIRBY_STATE.SLIDING ){
                this.trigger("change_state", WADDLE_STATE.DIE);
            }
            else{
                if(!this.skipCollision){Q.state.set("bar", Q.state.get("bar") - 1);}
                this.trigger("change_state", WADDLE_STATE.DIE);
            }
        }
        if(collision.obj.isA("FireWaddle")){
            this.p.flip=this.flipActual;
        }
    },


    attack: function(){
        //this.isStatue = true;
       
        var stage=Q.stage(0);
        var fire = stage.insert(new Q.FireWaddle({
            y:this.p.y,
            x:this.p.x,
            vx:this.p.vx,
            direction:this.p.direction
         }));
         this.p.vx=0;
        

    },

    // Update Step
    step: function(dt){
        this.attackTime += dt;
        if(this.attackTime>=7){
            this.trigger("change_state", WADDLE_STATE.ATTACK);
        }
        switch(this.state){
            case WADDLE_STATE.IDLE:
            if(this.p.vx !== 0){
                this.p.direction = (this.p.vx > 0) ? "right" : "left";
            }
            //this.p.vx = 40 * ((this.p.direction === "left") ? -1 : 1);
            
            this.trigger("cplay", "idle");

            break;

            case  WADDLE_STATE.DIE:

                this.trigger("cplay", "die");
                this.skipCollision = true,
                this.p.isStatue = true;
                this.p.gravity = false;
                this.p.vx = 0;
                this.dieTime+=dt;
                if(this.dieTime>=0.15){
                    this.destroy();
                }
            break;

            case WADDLE_STATE.ATTACK:

                this.endAttackTime += dt;
                if(this.firstAttack){
                    this.flipActual=this.p.flip;
                    this.trigger("cplay", "attack");
                    this.firstAttack=false;
                    this.attack();
                }
                
                if(this.endAttackTime > 3){
                    this.trigger("change_state", WADDLE_STATE.IDLE);
                    //this.isStatue=false;
                    this.endAttackTime = 0;
                    this.attackTime=0;
                    this.firstAttack=true;
                }
                
                break;
             
        }
        // Flip in movement
        this.p.flip = (this.p.direction === "left") ? false : "x";
         },
});





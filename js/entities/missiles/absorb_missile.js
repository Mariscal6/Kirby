/* Load Sprite */

compiling.sheet.push({
    "png_path": "absorbing.png",
    "json_path": "absorbing.json"
});

Q.animations("absorb_missile", {
    absorb: {
        frames: [0, 1, 2],
        rate: 1/8, 
        collision_box: {
            width: 64,
            height: 64,
        }
    },

});

/* Animations */


Q.Sprite.extend("Absorb", {

    init: function(p){
        this._super(p, {
            sheet: "absorb",
            sprite: "absorb_missile",
            gravity: 0,
            x: 100,
            y: 450,
            skipCollision: true,
        });
        //console.log(Q._animations);
        //console.log(Q.animation(this.p.animation, this.p.sprite));

        this.onScreen = false;

        this.isParticle = true;

        this.add("Entity");

        this.on("bump", this, "absorbing");
    },

    draw: function(ctx){
        if(!this.onScreen) return;
        this._super(ctx);
    },

    // Update
    update: function(dt){
        // Set out of bound
        if(!this.onScreen){
            this.p.x = -1000;
            this.p.y = -1000;
            return;
        }
        this._super(dt);
    },

    absorbing: function(collide){
        const entity = collide.obj;
        if(entity.isParticle || entity.isA("Kirby") || entity.isA("TileLayer")) return;
        

        entity.p.isStatue = true;
        const w = this.sheet().w;
        const direction = this.p.flip === "x" ? -1 : 1;
        const ix = this.p.x + direction * w / 2;
        const ex = entity.p.x;
        
        //console.log();
        //entity.p.vx = (ix - ex) / w * 300;
    },

    // Update Step
    step: function(dt){
        if(this.onScreen){
            this.trigger("cplay", "absorb");
            const kirby = Q("Kirby").first();
            const kirby_collision_width = Q.animation(kirby.p.sprite, kirby.p.animation).collision_box.width;
            const absorb_collision_width = Q.animation(this.p.sprite, this.p.animation).collision_box.width;

            this.p.x = kirby.p.x + (absorb_collision_width + kirby_collision_width) / 2 * (kirby.p.direction === "left" ? -1 : 1);
            this.p.y = kirby.p.y;

            this.p.skipCollision = true;
            this.p.gravity = false;
            this.p.flip = kirby.p.flip;
        }
    },

});






//set the global variables
var enemyImage = [];
var enemy = [];
var enemy1 = [];
var box = [];
var shoot = [];
var reload = [];
var pickEnemy = [];
var bcgImage = [];
var gunImage = [];
var weaponDamage;
var weaponAmmo;
var enemyCount;
var enemyTimeout = [];
var enemyCalculator = [];
var playerHealth;
var targetCount;
var gameOver;
var Bag = [];
var mission_Bag = [];
var scoreCount;

//set the global variables' values
enemyCount = 0;
enemyCalculator[0] = 0;
enemyCalculator[1] = 0;
enemyCalculator[2] = 0;
playerHealth = 100;
targetCount = 0;
scoreCount = 0;
gameOver = true;

/* ---------- Create the Weapon object ---------- */
function weapon(weaponId, weaponName, weaponBullet, weaponDamage, weaponPicture) {
    this.weaponId = weaponId;
    this.weaponName = weaponName;
    this.weaponBullet = weaponBullet;
    this.weaponDamage = weaponDamage;
    this.weaponPicture = weaponPicture;
}

/* ---------- Function for Weapons Bag ---------- */
$(document).ready(function() {
/* ---------- Create the Original Data ---------- */
    Bag[0] = new weapon(0, "GLOCK", 10, 1, "image/1.png");
    Bag[1] = new weapon(1, "MP5", 20, 1, "image/2.png");
    Bag[2] = new weapon(2, "FAMAS", 30, 1, "image/3.png");
    Bag[3] = new weapon(3, "AK47", 20, 2, "image/4.png");
    Bag[4] = new weapon(4, "M4A1", 30, 2, "image/5.png");
    Bag[5] = new weapon(5, "AWP", 10, 1, "image/6.png");
    for(var i=0; i<Bag.length; i++) {
        showWeapon(Bag[i]);
    }
    var $weapon_bag = $("#mission_weapon_bag");
    $('body').keydown(function(event) {
        if(event.which == 66) {
            $weapon_bag.toggle();
        }
    });
    //Refer from Bootstrap Tooltip
    $('[data-toggle="tooltip"]').tooltip();
});

/* ---------- This function is used to add the weapons to the WeaponBag ---------- */
function showWeapon(weapon) {
    //get the weapon_list ul
    var $weapon_list = $("#mission_weapon_list");
    var $deleteBtn;
    //create a new weapon in the Weapon Bag
    var $newWeaspon = $("<li><p>Weapon: "
                        + weapon.weaponName + "</p><p>Ammo: "
                        + weapon.weaponBullet + "</p><p>Damage: "
                        + weapon.weaponDamage + "</p><br/><div class=\"mission_weapon_img\"><img src=\""
                        + weapon.weaponPicture + "\"></div><br/>"
                        + "<div class=\"mission_equipBtn\"><button class=\"equip\" id=\"equip" + weapon.weaponId + "\">EQUIP</button></div></li>"
                       );
    //set the id to the new weapon
    $newWeaspon.attr("id", "weapon" + weapon.weaponId);
    //append the new weapon to the Weapon Bag
    $weapon_list.append($newWeaspon);
    $equipBtn = $("#equip" + weapon.weaponId);
    $equipBtn.one("click", equipWeapon);
}

/* ---------- This function is to equip the weapon ---------- */
function equipWeapon(event) {
    //get the event.target
    var equipButton = event.target;
    //get the target's id without the 'delete'
    var equipNum = Number(equipButton.id.slice(5));
    var equipName = Bag[equipNum].weaponName;
    var holdImage;
    var i = mission_Bag.length;
    mission_Bag[i] = Bag[equipNum];
    $(".mission_equip_list li").eq(i).empty();
    $(".mission_equip_list li").eq(i).append("<img src=\"" + mission_Bag[i].weaponPicture+ "\">");
    $(".start_cover").hide();
}

//if the players finish the instruction, show them the weapon bag
function finishInstruction() {
    $(".mission_instruction").hide();
    $("#mission_weapon_bag").show();
}

//if the players click the reset button, reset the equiped list
function equipReset() {
    for(var i=0; i<Bag.length; i++) {
        //show the number of the list
        $("#equip"+i).off("click");
        $("#equip"+i).one("click", equipWeapon);
        $(".mission_equip_list li").eq(i).text(i+1);
    }
    //remove all the weapon from the list
    $(".mission_equip_list li").each(function() {
        mission_Bag = [];
        $(this).children().remove();
    });
    $(".start_cover").show();
}

//if the players click start button, starts the game
function gameStart() {
    var $weapon_bag = $("#mission_weapon_bag");
    if(mission_Bag.length > 0) {
        //hide the weapona bag
        $weapon_bag.fadeOut();
        //set the variables to according to the equiped weapon
        gameOver = false;
        weaponDamage = mission_Bag[0].weaponDamage;
        weaponAmmo = mission_Bag[0].weaponBullet;
        bullet.bulletCount = weaponAmmo;
        //change the weapon image according the first equiped weapon
        if(mission_Bag[0].weaponName == 'GLOCK') {
            gun.img = gunImage[0];
        }
        if(mission_Bag[0].weaponName == 'MP5') {
            gun.img = gunImage[1];
        }
        if(mission_Bag[0].weaponName == 'FAMAS') {
            gun.img = gunImage[2];
        }
        if(mission_Bag[0].weaponName == 'AK47') {
            gun.img = gunImage[3];
        }
        if(mission_Bag[0].weaponName == 'M4A1') {
            gun.img = gunImage[4];
        }
        if(mission_Bag[0].weaponName == 'AWP') {
            gun.img = gunImage[5];
        }
    }
}

/* ---------- This function is used to refresh the page ---------- */
function gameTryAgain() {
    location.reload();
}
 
/* ---------- This function is used to exit the game ---------- */
function gameExit() {
    window.location.replace("index.html");
}

$("#instruction_go").click(finishInstruction);

/* ---------- If the player clicks the reset button, reset the equip list ---------- */
$("#reset_btn").click(equipReset);

/* ---------- If the player clicks the start button, start the game and hide the weapon bag ---------- */
$("#start").click(gameStart);

/* ---------- If the player clicks the try again button, restart the game ---------- */
$("#tryAgain").click(gameTryAgain);

/* ---------- If the player clicks the exit button, go back to the index.html ---------- */
$("#start_exit").click(gameExit);
$("#over_exit").click(gameExit);

/* ---------- Setup all the variables for the whole scene ---------- */
function setup() {
    //create the Canvas
    var myCanvas = createCanvas(800,600);
    //set the image to an Array
    bcgImage[0] = loadImage("image/mission/missionA_bcg.jpg");
    bcgImage[1] = loadImage("image/mission/missionB_bcg.jpg");
    gunImage[0] = loadImage("image/mission/glock.png");
    gunImage[1] = loadImage("image/mission/mp5.png");
    gunImage[2] = loadImage("image/mission/famas.png");
    gunImage[3] = loadImage("image/mission/ak47.png");
    gunImage[4] = loadImage("image/mission/m4a1.png");
    gunImage[5] = loadImage("image/mission/awp.png");
    myCanvas.parent('holder');
    smooth();
  
    //  load the 6 different sizes and appearances of enemies
    for(var i = 0; i < 6; i++) {
        if(i == 0) {
          enemyImage[i] = loadImage("image/mission/enemy1.png");
        }
        else if(i == 1) {
          enemyImage[i] = loadImage("image/mission/enemy2.png");
        }
        else if(i == 2) {
          enemyImage[i] = loadImage("image/mission/enemy3.png");
        }
        else if(i == 3) {
          enemyImage[i] = loadImage("image/mission/enemy4.png");
        }
        else if(i == 4) {
          enemyImage[i] = loadImage("image/mission/enemy5.png");
        }
        else if(i == 5) {
          enemyImage[i] = loadImage("image/mission/enemy6.png");
        }
  }
    
  //  create enemies
  enemy[0] = new createEnemy(enemyImage[0],740,190,1,93,294,3);
  enemy[1] = new createEnemy(enemyImage[1],740,190,1,93,294,3);
  enemy[2] = new createEnemy(enemyImage[2],740,190,1,93,294,3);
  enemy[3] = new createEnemy(enemyImage[0],600,200,2,60,190,3);
  enemy[4] = new createEnemy(enemyImage[1],600,200,2,60,190,3);
  enemy[5] = new createEnemy(enemyImage[2],600,200,2,60,190,3);
  enemy[6] = new createEnemy(enemyImage[3],40,210,3,60,190,3);
  enemy[7] = new createEnemy(enemyImage[4],40,210,3,60,190,3);
  enemy[8] = new createEnemy(enemyImage[5],40,210,3,60,190,3);
  enemy[9] = new createEnemy(enemyImage[3],70,255,4,35,125);
  enemy[10] = new createEnemy(enemyImage[4],70,255,4,35,125);
  enemy[11] = new createEnemy(enemyImage[5],70,255,4,35,125);
  enemy[12] = new createEnemy(enemyImage[0],380,250,5,35,125);
  enemy[13] = new createEnemy(enemyImage[1],380,250,5,35,125);
  enemy[14] = new createEnemy(enemyImage[2],380,250,5,35,125);
  enemy[15] = new createEnemy(enemyImage[0],825,205,6,35,125);
  enemy[16] = new createEnemy(enemyImage[1],825,205,6,35,125);
  enemy[17] = new createEnemy(enemyImage[2],825,205,6,35,125);
    
  //  create the boxs to cover the enemies
  for(var i=0; i<6; i++) {
    if(i == 0) {
      box[i] = loadImage("image/mission/boxA.jpg");
    }
    if(i == 1) {
      box[i] = loadImage("image/mission/boxB.jpg");
    }
    if(i == 2) {
      box[i] = loadImage("image/mission/boxC.jpg");
    }
    if(i == 3) {
      box[i] = loadImage("image/mission/missionB_boxA.jpg");
    }
    if(i == 4) {
      box[i] = loadImage("image/mission/missionB_boxB.jpg");
    }
    if(i == 5) {
      box[i] = loadImage("image/mission/missionB_boxC.png");
    }
  }
}

/* ---------- This is the main Draw function ---------- */
function draw() {
    background(bcgImage[1]);
    //if gameove is false, play the game
    if(gameOver == false) {
        //count to the next enemy
        enemyCount ++;
        if(enemyCount == 1) {
            //pick one of the enemy from 9 randomly
            pickEnemy = Math.floor(Math.random() * 8 + 9);
        }
        //count the display the enemies
        else if(180 < enemyCount && enemyCount< 300) {
            enemy[pickEnemy].move();
            enemy[pickEnemy].display();
            //show the box to cover the enemies
            if(pickEnemy < 3) {
                image(box[0],0,0);
            }
            //show the box to cover the enemies
            else if(pickEnemy > 2 && pickEnemy < 6) {
                image(box[1],276,0);
            }
            //show the box to cover the enemies
            else if(pickEnemy > 5 && pickEnemy < 9) {
                image(box[2],722,0);
            }
            //show the box to cover the enemies
            else if(pickEnemy > 8 && pickEnemy < 12) {
                image(box[3],0,0);
            }
            //show the box to cover the enemies
            else if(pickEnemy > 11 && pickEnemy < 15) {
                image(box[4],276,0);
            }
            //show the box to cover the enemies
            else if(pickEnemy > 14) {
                image(box[5],671,0);
            }
        }
        //if the enemy disappear, count to the next one again
        else if(enemyCount > 300) {
          enemyCount = 0;
        }
        //call the functions
        aim.display(mouseX,mouseY);
        gun.display(mouseX,mouseY);
        noCursor();
        bullet.display();
        bullet.reload();
        health.display();
        target.display();
        score.display();
        //if the amount of the ammo below 0, reload automatically
        if(bullet.bulletCount <= 0) {
            reload[0] = true;
            setTimeout(function() {
                reload[0] = false;
            }, 1000);
        }
        //if the players' health go below 0, game over
        if(playerHealth <= 0) {
            scene.gameOver();
        }
        //if the players kill the target amount of the enemies, win
        if(targetCount >= target.targetNum) {
            scene.gameWin();
        }
    }
}

/* ---------- This function is to create the aim of the gun ---------- */
var aim = {
    x: null,
    y: null,
    //to display the aim
    display: function(tempX, tempY) {
        //  show the red aim appearance
        this.x = tempX;
        this.y = tempY;
        stroke(255,0,0);
        strokeWeight(2);
        noCursor();
        fill(0,0);
        ellipse(this.x,this.y,40,40);
        line(this.x-20,this.y,this.x+20,this.y);
        line(this.x,this.y-20,this.x,this.y+20);
    },
    
    //to shoot at the enemy
    shoot: function(posx, posy, enemy) {
        var distance;
        distance = dist(posx, posy, enemy.x + enemy.w/2, enemy.y);
        if(enemyCount > 180 && enemyCount < 300) {
            if(this.x > enemy.x && this.x < enemy.x + enemy.w && this.y > enemy.y + enemy.h/5 && this.y < enemy.y + enemy.h) {  
            //if shoot at the enemies' bodies, count the damage
                enemy.health -= weaponDamage;
                if(enemy.health <= 0) {
                    enemy.shot();
                    scoreCount += 100;
                }
            }
            if(distance < enemy.w/3) {
                    //  if shoot at the enemies' heads, the damage will be trible
                    enemy.shot();
                    scoreCount += 150;
            }
        }
    }
}

/* ---------- This function is to create the gun ---------- */
var gun = {
    x: null,
    y: null,
    moveX: null,
    moveY: null,
    gunPressed: null,
    img: '',
    
    //display the gun
    display: function(tempX, tempY) {
        if(bullet.reloadCount < 50 && bullet.reloadCount > 0) {
          //  if player reload the gun, the gun will go down
          this.y += 50;
        }
        //move the gun according to the cursor
        else if(bullet.reloadTime == 0) {
          this.x = tempX;
          this.y = tempY;
        }
        //if players left click, move the image of the gun
        if(bullet.empty()  == false) {
            if(shoot[0] == true) {
                    this.moveX = 40;
                    this.moveY = 40;
            }
            //if the ammo of the gun below 0, don't move it any more
            else if(shoot[0] == false || bullet.bulletCount == 0){
                    this.moveX = 0;
                    this.moveY = 0;
            }
        }
        //if the y position is greater than 300, move it up
        if(this.y <= 300) {
            image(this.img, this.x + this.moveX, 420 - (300 - this.y)/6 + this.moveY); 
        }
        //if the y position is greater than 300, move it slower
        else {
            image(this.img, this.x + this.moveX, 420 + (this.y - 300)/2 + this.moveY);
        }
    }
}

/* ---------- This function is to create the players' health and display it ---------- */
var health = {
    display: function() {
    //set the string of the Health
    var healthText =  "Health: " + playerHealth; 
    //display it on the corner
    fill(255);
    textAlign(CORNER);
    textSize(20);
    text(healthText,20,560);
    },
}

/* ---------- This function is to create the bullet ---------- */
var bullet = {
    bulletTime: 0,
    reloadTime: 0,
    reloadCount: 0,
    //display it on the corner
    display: function() {
        //set the string of the Ammo
        var bulletText = "Ammo: "+this.bulletCount;
        fill(255);
        textAlign(CORNER);
        textSize(20);
        if(this.bulletCount < 1) {
          this.bulletCount = 0;
        }
        text(bulletText,690,580);
    },
    
    //If the Ammo is below 0, set the empty to true
    empty: function() {
        //  if the bullet become empty, players cannot shoot
        if(this.bulletCount <= 0 || this.reloadTime == 1) {  
          return true;
        }
        else {
          return false;
        }
    },
    
    reload: function() {
        if(reload[0] == true) {
            //When the player reloads the gun, set the Ammo amount back
            this.bulletCount = weaponAmmo;
            this.reloadTime = 1;
        }
        if(this.reloadTime == 0) {
          this.reloadCount = 0;
        }
        if(this.reloadTime == 1) {
          this.reloadCount += 1;
        }
        if(this.reloadCount >= 50) {
          this.reloadTime = 0;
        }
    }
}

/* ---------- This function is to create the enemy ---------- */
function createEnemy(tempimg, tempx, tempy, temppoint, tempw, temph, health) {
    this.x = tempx;
    this.y = tempy;
    this.w = tempw;
    this.h = temph;
    this.start = tempx;
    this.finish = tempy;
    this.img = tempimg;
    this.point = temppoint;
    this.count = 0;
    this.health = health;
    //count to move the enemies when they show up
    this.move = function() {
        if(this.point == 1) {
            if(this.x >= this.start - 150 && enemyCalculator[0] == 0) {
                this.x -= 7.5;
                    if(this.x == this.start - 150) {
                        //if the player don't shoot the enemies in 1 second, substrate 10 of the players' health
                        enemyTimeout[0] = setTimeout(function() {
                            playerHealth -= 10;
                            //once the players get shot, change the screen to red just one moment
                            $(".game_shot").show();
                            setTimeout(function() {
                                $(".game_shot").hide();
                            }, 50);
                            enemyCalculator[0] = 1;
                        }, 1000);
                    }
            }
            if(this.x <= this.start && enemyCalculator[0] == 1) {
                this.x += 7.5;
                if(this.x == this.start) {
                    enemyTimeout[1] = setTimeout(function() {
                            enemyCalculator[0] = 0;
                    }, 1000);
                }
            }
        }
        
        if(this.point == 2) {
            if(this.x >= this.start - 120 && enemyCalculator[1] == 0) {
                this.x -= 6;
                if(this.x == this.start - 120) {
                    //if the player don't shoot the enemies in 1 second, substrate 10 of the players' health
                    enemyTimeout[2] = setTimeout(function() {
                            playerHealth -= 10;
                            //once the players get shot, change the screen to red just one moment
                            $(".game_shot").show();
                            setTimeout(function() {
                                $(".game_shot").hide();
                            }, 100);
                            enemyCalculator[1] = 1;
                    }, 1000);
                }
            }
            if(this.x <= this.start && enemyCalculator[1] == 1) {
                this.x += 6;
                if(this.x == this.start) {
                    enemyTimeout[3] = setTimeout(function() {
                            enemyCalculator[1] = 0;
                    }, 1000);
                }
            }
        }
        
        if(this.point == 3) {
            if(this.x <= this.start + 120 && enemyCalculator[2] == 0) {
                this.x += 6;
                if(this.x == this.start + 120) {
                    //if the player don't shoot the enemies in 1 second, substrate 10 of the players' health
                    enemyTimeout[4] = setTimeout(function() {
                            playerHealth -= 10;
                            //once the players get shot, change the screen to red just one moment
                            $(".game_shot").show();
                            setTimeout(function() {
                                $(".game_shot").hide();
                            }, 100);
                            enemyCalculator[2] = 1;
                    }, 1000);
                }
            }
            if(this.x >= this.start && enemyCalculator[2] == 1) {
                this.x -= 6;
                if(this.x == this.start) {
                    enemyTimeout[5] = setTimeout(function() {
                            enemyCalculator[2] = 0;
                    }, 1000);
                }
            }
        }
        
        if(this.point == 4) {
            if(this.x <= this.start + 120 && enemyCalculator[2] == 0) {
                this.x += 6;
                if(this.x == this.start + 120) {
                    //if the player don't shoot the enemies in 1 second, substrate 10 of the players' health
                    enemyTimeout[4] = setTimeout(function() {
                            playerHealth -= 10;
                            //once the players get shot, change the screen to red just one moment
                            $(".game_shot").show();
                            setTimeout(function() {
                                $(".game_shot").hide();
                            }, 100);
                            enemyCalculator[2] = 1;
                    }, 1000);
                }
            }
            if(this.x >= this.start && enemyCalculator[2] == 1) {
                this.x -= 6;
                if(this.x == this.start) {
                    enemyTimeout[5] = setTimeout(function() {
                            enemyCalculator[2] = 0;
                    }, 1000);
                }
            }
        }
        
        if(this.point == 5) {
            if(this.x >= this.start - 120 && enemyCalculator[0] == 0) {
                this.x -= 7.5;
                    if(this.x == this.start - 120) {
                        //if the player don't shoot the enemies in 1 second, substrate 10 of the players' health
                        enemyTimeout[0] = setTimeout(function() {
                            playerHealth -= 10;
                            //once the players get shot, change the screen to red just one moment
                            $(".game_shot").show();
                            setTimeout(function() {
                                $(".game_shot").hide();
                            }, 50);
                            enemyCalculator[0] = 1;
                        }, 1000);
                    }
            }
            if(this.x <= this.start && enemyCalculator[0] == 1) {
                this.x += 7.5;
                if(this.x == this.start) {
                    enemyTimeout[1] = setTimeout(function() {
                            enemyCalculator[0] = 0;
                    }, 1000);
                }
            }
        }
        
        if(this.point == 6) {
            if(this.x >= this.start - 120 && enemyCalculator[0] == 0) {
                this.x -= 7.5;
                    if(this.x == this.start - 120) {
                        //if the player don't shoot the enemies in 1 second, substrate 10 of the players' health
                        enemyTimeout[0] = setTimeout(function() {
                            playerHealth -= 10;
                            //once the players get shot, change the screen to red just one moment
                            $(".game_shot").show();
                            setTimeout(function() {
                                $(".game_shot").hide();
                            }, 50);
                            enemyCalculator[0] = 1;
                        }, 1000);
                    }
            }
            if(this.x <= this.start && enemyCalculator[0] == 1) {
                this.x += 7.5;
                if(this.x == this.start) {
                    enemyTimeout[1] = setTimeout(function() {
                            enemyCalculator[0] = 0;
                    }, 1000);
                }
            }
        }
        
    }
    
    //display the image of the enemies
    this.display = function() {
          image(this.img, this.x, this.y, this.w, this.h);  
      }
    
    //if the players kill the enemies, reset the counting and add one to the target
    this.shot = function() {
        this.x = this.start;
        enemyCount = 0;
        enemyCalculator[0] = 0;
        enemyCalculator[1] = 0;
        enemyCalculator[2] = 0;
        for(var i=0; i<enemyTimeout.length; i++) {
            clearTimeout(enemyTimeout[i]);
        }
        targetCount += 1;
    }
}

/* ---------- This function is to create the target number ---------- */
var target = {
    //set the number to 10
    targetNum: 10,
    //display the target number on the corner
    display: function() {
    var targetText ="Target: "+targetCount+"/"+this.targetNum;  //set the string of the Target
    fill(255);
    textAlign(CORNER);
    textSize(20);
    text(targetText,20,585);
    }
}

/* ---------- This function is to create the score ---------- */
var score = {
    //display the score on the corner
    display: function() {
    var scoreText ="Score: "+scoreCount;   //set the string of the Score
    fill(255);
    textAlign(CORNER);
    textSize(20);
    text(scoreText,20,35);
    }
}

/* ---------- This function is to set the game over and game win screen ---------- */
var scene = {
    //if the players fail, show the screen and the score
    gameOver: function() {
        gameOver = true;
        $(".game_over_score").text("Your Score: "+scoreCount);
        $(".game_over").fadeIn(1000, function() {
            $(".game_over_fail").fadeIn(1000, function() {
                $(".game_over_score").fadeIn(1000, function() {
                    $(".game_over_button").fadeIn(1000);
                });
            });
        });
    },
    
    //if the players success, show the screen and the score
    gameWin: function() {
        gameOver = true;
        $(".game_over_score").text("Your Score: "+scoreCount);
        $(".game_over").fadeIn(function() {
            $(".game_over_win").fadeIn(1000, function() {
                $(".game_over_score").fadeIn(1000, function() {
                    $(".game_over_button").fadeIn(1000);
                });
            });
        });
    },
}

/* ---------- Set the mousePressed function ---------- */
function mousePressed() {
    //if the gun is not empty, the players can shoot
    if(bullet.empty() == false || reload[0] == false) {
        bullet.bulletCount -= 1;
        //call the aim's shooting function
        for(var i=0; i<enemy.length; i++) {
            aim.shoot(mouseX, mouseY, enemy[i]);
        }
    }
    shoot[0] = true;
    setTimeout(function() {
    shoot[0] = false;
    }, 80);
}

/* ---------- Set the keyPressed function ---------- */
function keyPressed() {
    if(keyCode == 82) {
        //when presses the R key, reload the gun
        reload[0] = true;
    }
    //when the players press the number from 1 to 6, change the weapon according to the number
    if(keyCode == 49 || keyCode == 50 || keyCode == 51 || keyCode == 52 || keyCode == 53 || keyCode == 54)
    { 
        var getKey = keyCode - 49;
        var equipWeapon = mission_Bag[getKey];
        if(getKey <= mission_Bag.length-1) {
            reload[0] = true;
            weaponDamage = equipWeapon.weaponDamage;
            weaponAmmo = equipWeapon.weaponBullet;
            bullet.bulletCount = weaponAmmo;
            if(equipWeapon.weaponName == 'GLOCK') {
                gun.img = gunImage[0];
            }
            if(equipWeapon.weaponName == 'MP5') {
                gun.img = gunImage[1];
            }
            if(equipWeapon.weaponName == 'FAMAS') {
                gun.img = gunImage[2];
            }
            if(equipWeapon.weaponName == 'AK47') {
                gun.img = gunImage[3];
            }
            if(equipWeapon.weaponName == 'M4A1') {
                gun.img = gunImage[4];
            }
            if(equipWeapon.weaponName == 'AWP') {
                gun.img = gunImage[5];
            }
        }
    }
    //if the players press the esc, go back to the maze
    if(keyCode == 27) {
        window.location.replace("index.html");
    }
    setTimeout(function() {
        reload[0] = false;
    }, 1000);
}
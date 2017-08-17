/**
 * Copyright (c) 2009, Benjamin Joffe
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE AUTHOR AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var map,
    canvas,
    overlay,
    bigsky,
    bigsky2,
    arena;
//variables initiated at the bottom of the code...

var pi = Math.PI;
var total = 0;
var arenaSize = 21;
var total = 0;
var samples = 400;
var playerPos = [3.5,3.5]; // x,y (from top left)
var playerDir = 0.4; // theta, facing right=0=2pi
var playerPosZ = 1;
var key = [0,0,0,0,0]; // left, right, up, down
var playerVelY = 0;
var face = [];
var weaponNum = 0;
var holdWeapon;
var Bag = [];
var weaponBag = [];
var mapWeaponBag = [];
var gunpick = [];
var mapWeaponNum = 0;
var mapWeaponImage = [];
for(var i=0; i<6; i++) {
    gunpick[i] = false;
}
function initArena(arenaWidth,arenaLength) {
    var arena=[];
    for (var i=0; i<arenaWidth; i++) {
        arena[i] = [];
        for (var j=0; j<arenaLength; j++) {
            arena[i][j] = 1;
            if (i==0 || i==(arenaWidth-1)) {arena[i][j]=2;} // east-west borders
            if (j==0 || j==(arenaLength-1)) {arena[i][j]=2;} // north-south borders
        }
    }

    //do the Depth First Search (DFS) maze generation algorithm
    var cellStack = [];
    var totalCells = (arenaLength-1)/2 * (arenaWidth-1)/2;
    var currCell = [3,3]; // must be odd number indices, goes with playerPos
    var currX = currCell[0];
    var currY = currCell[1];
    arena[currX][currY] = 0; //clear the starting cell
    var cellsBeen = 1;
    while (cellsBeen < totalCells) {
        var potentialNextCells = [1,1,1,1]; // all 4 directions (WSEN) are potential to start

        // remove some potential directions
        var currCellVal = getVal(arena,currCell);
        if (currCellVal[0] != 1) { // west border(2) or already been west(0)
            potentialNextCells[0] = 0;
        }
        if (currCellVal[1] != 1) { // south border(2) or already been south(0)
            potentialNextCells[1] = 0;
        }
        if (currCellVal[2] != 1) { // east border(2) or already been east(0)
            potentialNextCells[2] = 0;
        }
        if (currCellVal[3] != 1) { // north border(2) or already been north(0)
            potentialNextCells[3] = 0;
        }

        // pick which way to go from remaining potentials or back up if all potentials were removed
        var potentialSum = potentialNextCells[0]+potentialNextCells[1]+potentialNextCells[2]+potentialNextCells[3];
        if (potentialSum > 0) { // at least one potential
            var pickList = [];
            if (potentialNextCells[0]) { pickList.push("W"); }
            if (potentialNextCells[1]) { pickList.push("S"); }
            if (potentialNextCells[2]) { pickList.push("E"); }
            if (potentialNextCells[3]) { pickList.push("N"); }
            var picked = pickList[Math.floor( Math.random()*pickList.length )];
            switch(picked) {
                case "W" : //go west, knock down walls
                    cellStack.push(currCell);
                    arena[currX-1][currY] = 0; //clear the intermediate point
                    currX = currX - 2;
                    currCell = [currX,currY];
                    arena[currX][currY] = 0; //clear the new cell
                    break;
                case "S" : //go south, knock down walls
                    cellStack.push(currCell);
                    arena[currX][currY+1] = 0; //clear the intermediate point
                    currY = currY + 2;
                    currCell = [currX,currY];
                    arena[currX][currY] = 0; //clear the new cell
                    break;
                case "E" : //go east, knock down walls
                    cellStack.push(currCell);
                    arena[currX+1][currY] = 0; //clear the intermediate point
                    currX = currX + 2;
                    currCell = [currX,currY];
                    arena[currX][currY] = 0; //clear the new cell
                    break;
                case "N" : //go north, knock down walls
                    cellStack.push(currCell);
                    arena[currX][currY-1] = 0; //clear the intermediate point
                    currY = currY - 2;
                    currCell = [currX,currY];
                    arena[currX][currY] = 0; //clear the new cell
                    break;
                default : //now what?
            }
            cellsBeen = cellsBeen + 1;
        } else { // no potentials, then back up
            currCell = cellStack.pop();
            currX = currCell[0];
            currY = currCell[1];
        }
    }
    return arena;
}

function initUnderMap(){
    var holdImage = "image/knife_hold.gif";
    var hodeWeapon = "KNIFE";
    var ulen = arena.length;
    var uwid = arena[0].length;
    // var underMap=Raphael(document.getElementById("underMap"),uwid*8,ulen*8);
    map.rect(0,0, uwid*24, ulen*24).attr({fill:"#FFF", stroke:"#fff"});
    for (var i=0; i<uwid; i++) {
        for (var j=0; j<ulen; j++) {
            var i8 = i*24;
            var j8 = j*24;
            if (arena[i][j]==1) { map.rect(i8,j8, 24,24).attr({fill:"#444", stroke:"#444"}); }
            if (arena[i][j]==2) { map.rect(i8,j8, 24,24).attr({fill:"#888", stroke:"#888"}); }
            //Add the Weapon to the Map
            if (arena[i][j] != 1 && arena[i][j] != 2) {
                createWeapon(i8, j8);
            }
        }
    }
    canvas.rect(0, 300, 800, 300).attr({stroke: "none", fill: "0c2702-#022402-#031d07"});
    bigsky = canvas.image("sky.jpg", 0, 0, 2400, 300);
    bigsky2 = canvas.image("sky.jpg", 0, 0, 2400, 300);
    overlay = canvas.image(holdImage, 0, 0, 810, 610);
}

window.onload=function(){
    map=Raphael(document.getElementById("map"),500,500);
    canvas=Raphael(document.getElementById("canvas"),800,600);
    arena=initArena(arenaSize,arenaSize); //must be odd numbers > 3 for this style maze
    initUnderMap();
    drawCanvas();
    bigsky.attr({x: -playerDir/(2*pi)*2400});
    bigsky2.attr({x: 2399 - playerDir/(2*pi)*2400});
    setInterval(update, 35);
};

function getVal(maze,cell) {
    var neighbors = [];
    var ix = cell[0];
    var iy = cell[1];
    if (maze[ix-1][iy] == 2) { neighbors[0] = 2;  //W
    } else { neighbors[0] = maze[ix-2][iy]; }
    if (maze[ix][iy+1] == 2) { neighbors[1] = 2;  //S
    } else { neighbors[1] = maze[ix][iy+2]; }
    if (maze[ix+1][iy] == 2) { neighbors[2] = 2;  //E
    } else { neighbors[2] = maze[ix+2][iy]; }
    if (maze[ix][iy-1] == 2) { neighbors[3] = 2;  //N
    } else { neighbors[3] = maze[ix][iy-2]; }
    return neighbors;
}

function wallDistance(theta){
    var data=[];
    face=[];
    var x = playerPos[0], y = playerPos[1],
        deltaX, deltaY,
        distX, distY,
        stepX, stepY,
        mapX, mapY;
    var atX=Math.floor(x), atY=Math.floor(y);
    var thisRow=-1;
    var thisSide=-1;
    var lastHeight=0;
    /*
    if(x>19 && y>19) {
        mission();
    }
    */
    if(x>1 && x<20 && y>1 && y<20) {
        pickWeaponType(x, y);
    }
    playerPosition(Math.floor(x), Math.floor(y));
    for (var i=0; i<samples; i++) {
        theta+=pi/(3*samples)+2*pi;
        theta%=2*pi;
        mapX = atX;
        mapY = atY;
        deltaX=1/Math.cos(theta);
        deltaY=1/Math.sin(theta);
        if (deltaX>0) {
            stepX = 1;
            distX = (mapX + 1 - x) * deltaX;
        }
        else {
            stepX = -1;
            distX = (x - mapX) * (deltaX*=-1);      
        }
        if (deltaY>0) {
            stepY = 1;
            distY = (mapY + 1 - y) * deltaY;
        }
        else {
            stepY = -1;
            distY = (y - mapY) * (deltaY*=-1);
        }
        for (var j=0; j<20; j++) {
            if (distX < distY) {
                mapX += stepX;
                if (arena[mapX][mapY]) {
                    if (thisRow!=mapX || thisSide!=0) {
                        if (i>0) {
                            data.push(i);
                            data.push(lastHeight);
                        }
                        data.push(i);
                        data.push(distX);
                        thisSide=0;
                        thisRow=mapX;
                        face.push(1+stepX);
                    }
                    lastHeight=distX;
                    break;
                }
                distX += deltaX;
            }
            else {
                mapY += stepY;
                if (arena[mapX][mapY]) {
                    if (thisRow!=mapY || thisSide!=1) {
                        if (i>0) {
                            data.push(i);
                            data.push(lastHeight);
                        }   
                        data.push(i);
                        data.push(distY);
                        thisSide=1;
                        thisRow=mapY;
                        face.push(2+stepY);
                    }
                    lastHeight=distY;
                    break;
                }
                distY += deltaY;
            }
        }
    }
    data.push(i);
    data.push(lastHeight);
    return data;
}

function drawCanvas(){
    // var i = walls.length;
    // while (i--) walls[i].hide();
    var theta = playerDir-pi/6;
    var wall=wallDistance(theta);
    var linGrad;
    var tl,tr,bl,br;
    var theta1,theta2,fix1,fix2,j = 0,
        mapview = ["M", 24*playerPos[0], 24*playerPos[1], "L"];
    for (var i=0; i<wall.length; i+=4) {
        theta1=playerDir-pi/6 + pi*wall[i]/(3*samples);
        theta2=playerDir-pi/6 + pi*wall[i+2]/(3*samples);
        fix1 = Math.cos(theta1-playerDir);
        fix2 = Math.cos(theta2-playerDir);
        var h=2-playerPosZ;
        var wallH1=200/(wall[i+1]*fix1);
        var wallH2=200/(wall[i+3]*fix2);
        tl=[wall[i]*2 + .001, 300-wallH1*h];
        tr=[wall[i+2]*2 + .001, 300-wallH2*h];
        br=[wall[i+2]*2 + .001, tr[1]+wallH2*2];
        bl=[wall[i]*2 + .001, tl[1]+wallH1*2];
        var shade1=Math.floor(wallH1*2+20); if (shade1>255) shade1=255;
        var shade2=Math.floor(wallH2*2+20); if (shade2>255) shade2=255;
        var c1 = '#555';
        var c2 = '#222';
        !walls[j] && (walls[j] = canvas.path().attr({stroke: "none", fill: "#000"})).insertBefore(overlay);
        walls[j++].show().attr({
            path: ["M", tl, "L", tr, br, bl],
            //background: "url(background.jpg)",
            //fill: "url(background.jpg)",
            fill: "0-" + c1 + "-" + c2,
            //fill: "#696100",
            stroke: "#000",
            //fill: "0-" + c1 + "-" + c2
        });
        mapview = mapview.concat([playerPos[0]*24+Math.cos(theta1)*(wall[i+1])*24, playerPos[1]*24+Math.sin(theta1)*(wall[i+1])*24, playerPos[0]*24+Math.cos(theta2)*(wall[i+3])*24, playerPos[1]*24+Math.sin(theta2)*(wall[i+3])*24]);
    }
    
    if (!mapball) {
        mapball = map.circle(playerPos[0]*24, playerPos[1]*24, 6).attr({fill:"#36c", stroke: "none"});
        maplight = map.path(mapview).attr({fill:"#ffce00", stroke: "none"});
    } else {
        mapball.attr({
            cx: playerPos[0] * 24,
            cy: playerPos[1] * 24
        });
        //console.log(mapball.attr('cx'));
        maplight.attr({path: mapview});
    }
    while (walls[j]) walls[j++].hide();
}
var mapball, maplight, walls = [];

function nearWall(x,y){
    var xx,yy;
    if (isNaN(x)) x=playerPos[0];
    if (isNaN(y)) y=playerPos[1];
    for (var i=-0.1; i<=0.1; i+=0.2) {
        xx=Math.floor(x+i);
        for (var j=-0.1; j<=0.1; j+=0.2) {
            yy=Math.floor(y+j);
            if (arena[xx][yy]) return true;
        }
    }
    return false;
}

var wobbleGunX = 0;
var wobbleGunY = 0;
function wobbleGun(){
    var mag=playerVelY;
    $("body").mousedown(function() {
        wobbleGunX = 50;
        wobbleGunY = 50;
    });
    $("body").mouseup(function() {
        wobbleGunX = 0;
        wobbleGunY = 0;
    });
    overlay.attr({
        x: 10+Math.cos(total/6.23)*mag*90+wobbleGunX,
        y: 10+Math.cos(total/5)*mag*90+wobbleGunY,
    });
    // document.getElementById("overlay").style.backgroundPosition=(10+Math.cos(total/6.23)*mag*90)+"px "+(10+Math.cos(total/5)*mag*90)+"px";
}

$("body").mousedown(function() {
    overlay.attr({
        x: +50,
        y: +50,
    });
});
$("body").mouseup(function() {
    overlay.attr({
        x: 0,
        y: 0,
    });
});
var jumpCycle=0;
function update(){
    total++;
    var change=false;
    if (jumpCycle) {
        jumpCycle--;
        change=true;
        playerPosZ = 1 + jumpCycle*(20-jumpCycle)/110;
    }
    else if (key[4]) jumpCycle=20;
    if (key[0]) {
        if (!key[1]) {
            playerDir-=0.07; //left
            change=true;
        }
    }
    else if (key[1]) {
        playerDir+=0.07; //right
        change=true;
    }
    if (change) {
        playerDir+=2*pi;
        playerDir%=2*pi;
        bigsky.attr({x: 1-playerDir/(2*pi)*2400});
        bigsky2.attr({x: 2399 + 1-playerDir/(2*pi)*2400});
    }
    if (key[2] && !key[3]) {
        if (playerVelY<0.1) playerVelY += 0.02;
    }
    else if (key[3] && !key[2]) {
        if (playerVelY>-0.1) playerVelY -= 0.02;
    }
    else {
        if (playerVelY<-0.02) playerVelY += 0.015;
        else if (playerVelY>0.02) playerVelY -= 0.015;
        else playerVelY=0;
    }
    if (playerVelY!=0) {
        var oldX=playerPos[0];;
        var oldY=playerPos[1];      
        var newX=oldX+Math.cos(playerDir)*playerVelY;
        var newY=oldY+Math.sin(playerDir)*playerVelY;
        if (!nearWall(newX, oldY)) {
            playerPos[0]=newX;
            oldX=newX;
            change=true;
        }
        if (!nearWall(oldX, newY)) {
            playerPos[1]=newY;
            change=true;
        }
    }
    if (playerVelY) wobbleGun();
    if (change) drawCanvas();
}

function changeKey(which, to){
    switch (which){
        case 65:case 37: key[0]=to; break; // left
        case 87: case 38: key[2]=to; break; // up
        case 68: case 39: key[1]=to; break; // right
        case 83: case 40: key[3]=to; break;// down
        case 32: key[4]=to; break; // space bar;
        case 17: key[5]=to; break; // ctrl
    }
}
document.onkeydown=function(e){changeKey((e||window.event).keyCode, 1);};
document.onkeyup=function(e){changeKey((e||window.event).keyCode, 0);};


/* ---------- Function for Weapons Bag ---------- */
$(document).ready(function() {
    //set the global variable
    var $index_go = $("#index_go");
    var $index_instruction = $(".index_instruction");
    var $tool_bag = $(".tool_bag");
    var $tool_map = $(".tool_map");
    var $weapon_bag = $("#weapon_bag");
    var $map = $("#map_container");
    var $weapon_close = $("#weapon_close");
    var $map_close = $("#map_close");
    $('body').keydown(function(event) {
        if(event.which == 66) {
            $weapon_bag.toggle();
        }
        if(event.which == 49 || event.which == 50 || event.which == 51  || event.which == 52 || event.which == 53 || event.which == 54 ) {
            addWeapon(event.which);
        }
    });
    $index_go.click(function() {
        $index_instruction.hide();
    });
    //if the player clicks the weapon bag, pop up the weapon bag
    $tool_bag.click(function() {
        $weapon_bag.show();
    });
    //if the player click the close button, close the weapon
    $weapon_close.click(function() {
        $weapon_bag.hide();
    });
    //if the player clicks the weapon bag, pop up the map
    $tool_map.click(function() {
        $map.show();
        $map_close.click(function() {
            $map.hide();
        });
    });
    //if the player click the close button, close the map
    $map_close.click(function() {
        $map.hide();
    });
    //If the players pick more than one weapon, the mission's entrance will open
    mission();
    //Refer from Bootstrap Tooltip
    $('[data-toggle="tooltip"]').tooltip();
});

/* ---------- Create the Weapon object ---------- */
function weapon(weaponId, weaponName, weaponBullet, weaponDamage, weaponPicture, posx, posy) {
    this.weaponId = weaponId;
    this.weaponName = weaponName;
    this.weaponBullet = weaponBullet;
    this.weaponDamage = weaponDamage;
    this.weaponPicture = weaponPicture;
    this.posx = posx;
    this.posy = posy;
}

/* ---------- Create the mapWeapon object ---------- */
function mapWeapon(posx, posy) {
    this.posx = posx;
    this.posy = posy;
}

/* ---------- This function is to create the weapon in the map ---------- */
function createWeapon(x, y) {
    var weaponNum = Math.floor((Math.random() * 6) + 1);
    var weaponPosx = (Math.floor(Math.random() * 20) + 1 ) * 24;
    if(x == weaponPosx) {
        if(mapWeaponNum<6) {
            if(mapWeaponNum == 0) {
                mapWeaponBag[0] = new mapWeapon(x, y);
                mapWeaponImage[0] = map.rect(Math.floor(x), Math.floor(y), 24,24).attr({fill: "url(image/map_1.png)", stroke:"none"}); 
            }
            if(mapWeaponNum == 1) {
                mapWeaponBag[1] = new mapWeapon(x, y);
                mapWeaponImage[1] = map.rect(Math.floor(x), Math.floor(y), 24,24).attr({fill: "url(image/map_2.png)", stroke:"none"}); 
            }
            if(mapWeaponNum == 2) {
                mapWeaponBag[2] = new mapWeapon(x, y);
                mapWeaponImage[2] = map.rect(Math.floor(x), Math.floor(y), 24,24).attr({fill: "url(image/map_3.png)", stroke:"none"}); 
            }
            if(mapWeaponNum == 3) {
                mapWeaponBag[3] = new mapWeapon(x, y);
                mapWeaponImage[3] = map.rect(Math.floor(x), Math.floor(y), 24,24).attr({fill: "url(image/map_4.png)", stroke:"none"}); 
            }
            if(mapWeaponNum == 4) {
                mapWeaponBag[4] = new mapWeapon(x, y);
                mapWeaponImage[4] = map.rect(Math.floor(x), Math.floor(y), 24,24).attr({fill: "url(image/map_5.png)", stroke:"none"}); 
            }
            if(mapWeaponNum == 5) {
                mapWeaponBag[5] = new mapWeapon(x, y);
                mapWeaponImage[5] = map.rect(Math.floor(x), Math.floor(y), 24,24).attr({fill: "url(image/map_6.png)", stroke:"none"});
            }
            weaponPosition(mapWeaponNum, x/24, y/24);
            mapWeaponNum++;
        }
    }
}

/* ---------- This function is to set the weapon Type ---------- */
function pickWeaponType(posx, posy) {
    pickWeapon(posx, posy, 0);
    pickWeapon(posx, posy, 1);
    pickWeapon(posx, posy, 2);
    pickWeapon(posx, posy, 3);
    pickWeapon(posx, posy, 4);
    pickWeapon(posx, posy, 5);
}

/* ---------- If the players go to the weapon's position, they will pick up the weapon automatically ---------- */
function pickWeapon(posx, posy, x) {
    if(posx*24 > mapWeaponBag[x].posx && posx*24 < mapWeaponBag[x].posx+24 && posy*24 < mapWeaponBag[x].posy+24 && posy*24 > mapWeaponBag[x].posy) {
        if(gunpick[x] == false) {
        //show the notification to tell players they have new weapon
        var $notification_list = $(".notification_list");
        var $new_weapon = $("<li/>");
        var $new_mission = $("<li/>");
            $new_weapon.attr("class", "notification_weapon");
            $new_weapon.text("NEW WEAPON");
            //hide the notification if they have another new weapon
            $(".notification_weapon").slideUp(500, function() {
                $(this).remove();
            });
            $new_weapon.appendTo($notification_list).slideDown(500);
            setTimeout(function() {
                //hide the notification after specific time
                $new_weapon.slideUp(500, function() {
                    $(this).remove();
                });
            }, 3000);
            //show the notification to tell players they have new Mission
            $("body").one("keypress", addWeapon(49+x));
            if(Bag.length == 1) {
                $new_mission.attr("class", "notification_mission");
                $new_mission.text("NEW MISSION");
                $new_mission.appendTo($notification_list).slideDown(500);
                setTimeout(function() {
                    //hide the notification after specific time
                    $new_mission.slideUp(500, function() {
                        $(this).remove();
                    });
                }, 3000);
            }
            //show the picked on the weapon list after they are picked up
            gunpick[x] = true;
            mapWeaponImage[x].remove();
            $(".item_position li").eq(x+1).find("p").eq(0).text("PICKED");
            $(".item_position li").eq(x+1).find("p").eq(1).remove();
            $(".mission_cover").hide();
        }
    }
}

/* ---------- This function is to add the weapon ---------- */
function addWeapon(weaponNum) {
    //set i to the Bag.length
    var i = Bag.length;
    //create a new weapon object and set the data to it
    if(weaponNum == 49) {
        Bag[i] = new weapon(i, "GLOCK", 10, 1, "image/1.png", 24*2, 24*2);
    }
    if(weaponNum == 50) {
        Bag[i] = new weapon(i, "MP5", 20, 1, "image/2.png", 24*3, 24*3);
    }
    if(weaponNum == 51) {
        Bag[i] = new weapon(i, "FAMAS", 30, 1, "image/3.png", 24*4, 24*4);
    }
    if(weaponNum == 52) {
        Bag[i] = new weapon(i, "AK47", 20, 2, "image/4.png", 24*5, 24*5);
    }
    if(weaponNum == 53) {
        Bag[i] = new weapon(i, "M4A1", 30, 2, "image/5.png", 24*6, 24*6);
    }
    if(weaponNum == 54) {
        Bag[i] = new weapon(i, "AWP", 10, 3, "image/6.png", 24*7, 24*7);
    }
    showWeapon(Bag[i]);
}

/* ---------- This function is to equip the weapon ---------- */
function equipWeapon(event) {
    //get the event.target
    var equipButton = event.target;
    //get the target's id without the 'delete'
    var equipNum = Number(equipButton.id.slice(5));
    var equipName = Bag[equipNum].weaponName;
    var holdImage;
    if(equipName == "GLOCK") {
        holdImage = "image/glock_hold.gif";
        holdWeapon = "GLOCK";
    }
    if(equipName == "MP5") {
        holdImage = "image/mp5_hold.gif";
        holdWeapon = "MP5";
    }
    if(equipName == "FAMAS") {
        holdImage = "image/famas_hold.gif"
        holdWeapon = "FAMAS";
    }
    if(equipName == "AK47") {
        holdImage = "image/ak47_hold.gif"
        holdWeapon = "AK47";
    }
    if(equipName == "M4A1") {
        holdImage = "image/m4a1_hold.gif"
        holdWeapon = "M4A1";
    }
    if(equipName == "AWP") {
        holdImage = "image/awp_hold.gif"
        holdWeapon = "AWP";
    }
    //change the image of the gun
    overlay.hide();
    overlay = canvas.image(holdImage, 0, 0, 810, 610);
}

/* ---------- This function is used to add the weapons to the WeaponBag ---------- */
function showWeapon(weapon) {
    //get the weapon_list ul
    var $weapon_list = $("#weapon_list");
    var $deleteBtn;
    //create a new weapon in the Weapon Bag
    var $newWeaspon = $("<li><p>Weapon: "
                        + weapon.weaponName + "</p><p>Ammo: "
                        + weapon.weaponBullet + "</p><p>Damage: "
                        + weapon.weaponDamage + "</p><div class=\"weapon_img\"><img src=\""
                        + weapon.weaponPicture + "\"></div><div class=\"weapon_btn\">"
                        + "<button class=\"delete\" id=\"delete" + weapon.weaponId + "\">REMOVE</button>"
                        + "<button class=\"equip\" id=\"equip" + weapon.weaponId + "\">EQUIP</button></div></li>"
                       );
    //set the id to the new weapon
    $newWeaspon.attr("id", "weapon" + weapon.weaponId);
    //append the new weapon to the Weapon Bag
    $weapon_list.append($newWeaspon);
    //set a delete function to the delete button
    $deleteBtn = $("#delete" + weapon.weaponId);
    $equipBtn = $("#equip" + weapon.weaponId);
    $deleteBtn.one("click", deleteWeapon);
    $equipBtn.on("click", equipWeapon);
}

/* ---------- This function is used to delete an order object ---------- */
function deleteWeapon(event) {  
    var holdImage;
    //get the event.target
    var deleteButton = event.target;
    //get the target's id without the 'delete'
    var deleteNum = Number(deleteButton.id.slice(6));
    $(deleteButton).parent().parent().fadeOut(300, function() {
            $(this).remove();
        });
    //once the players delete the weapon they are holding, change the weapon to knife
    if(Bag[deleteNum].weaponName == holdWeapon) {
        holdImage = "image/knife_hold.gif"
        holdWeapon = "KNIFE";
        //change the image to the knife
        overlay.hide();
        overlay = canvas.image(holdImage, 0, 0, 810, 610);
    }
    //if the row is removed, set the row after it to covered its value & id
    for(var i = deleteNum; i<Bag.length-1; i++) {
        //if the row is deleted, replaced it by the later one
        Bag[i] = Bag[i+1];
        Bag[i].weaponId = i;
        $("#delete" + (i + 1)).attr("id", "delete" + i);
        $("#equip" + (i + 1)).attr("id", "equip" + i);
        $("weapon" + (i + 1)).attr("id", "weapon" + i);
    }   
        //remove the last one from the Weapon Bag
        Bag.pop();
}

/* ---------- This function is to save the weapon data to the JSON ---------- */
function saveData() {
    var mydata = {"weapons": Bag};
    $.post("weaponStorage.php", {json: JSON.stringify(mydata)});
}

/* ---------- This function is to reset the JSON data ---------- */
function resetData() {
    var mydata = {};
    $.post("weaponStorage.php", {json: JSON.stringify(mydata)});
}

/* ---------- Testing the mission in a quick way ---------- */
/*
$("body").keypress(function(event) {
    if(event.which == 13) {
    $(".missionEntrance").fadeToggle(function() {
        $("#enterMission").click(function() {
            console.log('saved');
            window.location.replace("mission.html");
        });
        $("#leaveMission").click(function() {
            resetData();
            console.log('reset');
            $(".missionEntrance").fadeToggle();
        });
    });
    }
});
*/

/* ---------- This function is to enter the mission ---------- */
function mission() {
    var $tool_mission = $(".tool_mission");
        $tool_mission.css("cursor", "pointer");
        $tool_mission.click(function() {
            //if the players click yes to enter the mission and save the data to JSON file
            $(".missionEntrance").fadeIn(function() {
                /*
                $("#enterMission").click(function() {
                    saveData();
                    window.location.replace("mission.html");
                });
                */
                //if the players click no just go back to the maze
                $("#leaveMission").click(function() {
                    $(".missionEntrance").fadeOut();
                });
            });
        });
}

/* ---------- Show the map if the player presses "M" ---------- */
$("body").keydown(function(event) {
    if(event.which == 77) {
        $("#map_container").show();
    }
});

/* ---------- Hide the map if the player relieve "M" ---------- */
$("body").keyup(function(event) {
    if(event.which == 77) {
        $("#map_container").hide();
    }
});

/* ---------- display the player position ---------- */
function playerPosition(posx, posy) {
    $(".item_position li").eq(0).html("<img src=\"image/player_position.jpg\" width=\"50px\"><p>X:"+posx+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y:"+posy+"</p>");
}

/* ---------- display the weapons position ---------- */
function weaponPosition(weaponNum, posx, posy) {
        $(".item_position li").eq(weaponNum+1).html("<img src=\"image/"+(weaponNum+1)+".png\" width=\"80px\"><p>X: "+posx+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Y: "+posy+"</p>");
}

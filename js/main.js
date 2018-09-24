window.onload = function() {

	game.init();
}

var game = {
	box: document.getElementById("box"),
	init: function() {
		//盒子置空
		game.box.innerHTML = "";
		//创建元素
		var oTitle = document.createElement("p");
		var oStart = document.createElement("div");
		oTitle.className = "title";
		oTitle.innerHTML = "打飞机1.0v-1001";
		oStart.className = "start";
		oStart.innerHTML = "<p>简单</p><p>一般</p><p>困难</p><p style='color:#f00;font-weight:bold;'>无敌</p>";
		//元素添加进盒子
		game.box.appendChild(oTitle);
		game.box.appendChild(oStart);
		var oP = oStart.getElementsByTagName("p");
		for (var i = 0; i < oP.length; i++) {
			oP[i].index = i;
			oP[i].onclick = function(e) {
				var ev = {
						'x': event.clientX,
						'y': event.clientY
					}
					//游戏模式根据index值确定
				game.model = this.index;
				game.start(ev);
			}
		}
	},
	diff: [
		[600, 1000, 0.2],
		[300, 400, 0.4],
		[100, 400, 0.8],
		[1, 200, 1]
	],
	scroll: function() {
		game.oScroll = document.createElement("span");
		game.oScroll.className = "scroll";
		game.box.appendChild(game.oScroll);
		game.Num = 0;
		game.oScroll.innerHTML = "0";
	},
	//游戏开始
	start: function(ev) {
		game.box.innerHTML = "";
		game.plan(ev);
		game.scroll();

	},
	//处理战机
	plan: function(ev) {
		var oPlane = document.createElement("img");

		oPlane.className = "plane";

		oPlane.src = "img/plane.png";
		game.box.appendChild(oPlane);
		var pL = game.box.offsetLeft + 10 + oPlane.clientWidth / 2;
		var pT = game.box.offsetTop + 10 + oPlane.clientHeight / 2;

		oPlane.style.left = ev.x - pL + "px";
		oPlane.style.top = ev.y - pT + "px";

		var boxW = game.box.clientWidth;
		var boxH = game.box.clientHeight;

		document.onmousemove = function(e) {
				var left = e.clientX - pL;
				var top = e.clientY - pT;

				if (left < -oPlane.clientWidth / 2) {
					left = -oPlane.clientWidth / 2;
				} else if (left > boxW) {
					left = boxW - oPlane.clientWidth / 2;
				} else if (top < 0) {
					top = 0;
				} else if (top > boxH) {
					top = boxH - oPlane.clientHeight / 2;
				}

				oPlane.style.left = left + "px";
				oPlane.style.top = top + "px";
				//			 game.bullet(left,top,oPlane);
			}
			//发射子弹
		oPlane.bTime = setInterval(function() {
				game.bullet(oPlane);
			}, game.diff[game.model][0])
			//发射敌机
		oPlane.eTime = setInterval(function() {
			game.enemy(oPlane);
		}, game.diff[game.model][1])
	},
	//敌机
	enemy: function(oPlane) {

		var oEmemy = document.createElement("img");
		oEmemy.className = "ememy";
		oEmemy.src = "img/enemy.png";
		game.box.appendChild(oEmemy);
		var oet = oEmemy.clientHeight;
		oEmemy.style.top = -oEmemy.clientHeight + "px";
		oEmemy.style.left = Math.random() * (game.box.clientWidth - oEmemy.clientWidth) + "px";
		var etMax = game.box.clientHeight;
		var sped = Math.random() * game.diff[game.model][2] + 0.2;
		oEmemy.animate = setInterval(function() {
			if (!oEmemy.parentNode) {
				clearInterval(oEmemy.animate);
				return false;
			};
			oet += sped;

			if (oet > etMax) {
				oet = etMax;
				oEmemy.style.top = oet + "px";
				clearInterval(oEmemy.animate);
				oEmemy.parentNode.removeChild(oEmemy);
			} else {
				oEmemy.style.top = oet + "px";
			}
		})

		oEmemy.time = setInterval(function() {

			var eT = parseInt(oEmemy.style.top);
			var eB = parseInt(oEmemy.style.top) + oEmemy.clientHeight;
			var eL = parseInt(oEmemy.style.left);
			var eR = parseInt(oEmemy.style.left) + oEmemy.clientWidth;

			var oImg = document.getElementsByTagName("img");

			for (var i = 0; i < oImg.length; i++) {

				if (oImg[i].className == "Bullet") {
					//					console.log("d")s

					var oT = parseInt(oImg[i].style.top);
					var oB = parseInt(oImg[i].style.top) + oImg[i].clientHeight;
					var oL = parseInt(oImg[i].style.left);
					var oR = parseInt(oImg[i].style.left) + oImg[i].clientWidth;

					if (oR > eL && oL < eR && oT < eB && oB > eT) {
						oEmemy.src = "img/boom.png";
						oImg[i].parentNode.removeChild(oImg[i]);

						oEmemy.dismiss = setInterval(function() {
							if (!oEmemy.parentNode) {
								clearInterval(oEmemy.dismiss);
								return false;
							}
							oEmemy.parentNode.removeChild(oEmemy);
							game.Num += 10;
							game.oScroll.innerHTML = game.Num;
						}, 300);
						clearInterval(oEmemy.time);

					}

				}

			}
			//判断战机的位置
			var pT = parseInt(oPlane.style.top);
			var pB = parseInt(oPlane.style.top) + oPlane.clientHeight;
			var pL = parseInt(oPlane.style.left);
			var pR = parseInt(oPlane.style.left) + oPlane.clientWidth;

			if (pR > eL && pL < eR && pT < eB && pB > eT) {
				oEmemy.src = "img/boom.png";
				oPlane.src = "img/boom2.png";

				document.onmousemove = function() {
					return false;
				}
				setTimeout(function() {
					if (!oPlane.parentNode) {
						return false;

					}
					oPlane.parentNode.removeChild(oPlane);
				}, 300)
				clearInterval(oPlane.bTime);
				clearInterval(oPlane.eTime);
				clearInterval(oEmemy.time);
				setTimeout(function() {
					game.over();
				}, 1000)

			}

		})

	},
	over: function() {
		var over = game.oScroll.innerHTML;
		game.box.innerHTML = "";
		var model, rank;
		switch (game.model) {
			case 0:
				model = "简单模式";
				if (over == 0) {
					rank = "垃圾儿，这都能零分!";
				} else if (over < 100) {
					rank = "勉强算你及格吧！";
				} else if (over < 1000) {
					rank = "可以呀，兄得！";
				} else if (over < 2000) {
					rank = "优秀啊，老铁！";
				} else if (over > 2000) {
					rank = "去更高场吧，去征服世界吧！";
				}
				break;
			case 1:
				model = "一般模式";
				if (over == 0) {
					rank = "去简单版吧！";
				} else if (over < 100) {
					rank = "勉强算你及格吧！";
				} else if (over < 1000) {
					rank = "可以呀，兄得！";
				} else if (over < 2000) {
					rank = "优秀啊，老铁！";
				} else if (over > 2000) {
					rank = "去更高场吧，去征服世界吧！";
				}
				break;
			case 2:
				model = "困难模式";
				if (over == 0) {
					rank = "留级深造!";
				} else if (over < 100) {
					rank = "勉强算你及格吧！";
				} else if (over < 1000) {
					rank = "可以呀，兄得！";
				} else if (over < 2000) {
					rank = "优秀啊，老铁！";
				} else if (over > 2000) {
					rank = "去更高场吧，去征服世界吧！";
				}
				break;
			case 3:
				model = "无敌模式";
				if (over == 0) {
					rank = "留级深造!";
				} else if (over < 100) {
					rank = "good！";
				} else if (over < 1000) {
					rank = "great！";
				} else if (over < 2000) {
					rank = "amazing！";
				} else if (over > 2000) {
					rank = "super start！";
				}
				break;
		}
		var oTip=document.createElement("div");
		var tTitle=document.createElement("p");
		var tScroll=document.createElement("p");
		var pScroll=document.createElement("p");
		var tModel=document.createElement("p");
		var pModel=document.createElement("p");
		var tRank=document.createElement("p");
		var pRank=document.createElement("p");
		var author=document.createElement("p");
		var reStart=document.createElement("input");
		
		oTip.className="oTip";
		tTitle.className="tTitle";
		tScroll.className="tScroll";
		pScroll.className="pScroll" ;
		tModel.className="tModel" ;
		pModel.className="pModel" ;
		tRank.className="tRank" ;
		pRank.className="pRank" ;
		reStart.className="reStart" ;
		author.className="author" ;
		
		tTitle.innerHTML="游戏结束";
		tScroll.innerHTML="你的得分";
		pScroll.innerHTML=over+"分";
		tModel.innerHTML="游戏模式";
		pModel.innerHTML=model;
		tRank.innerHTML="荣获称号";
		pRank.innerHTML=rank;
		reStart.id="reStart";
		author.innerHTML="Power By --杨益林";
		reStart.type="button";
		reStart.value="重新开始";
		
		oTip.appendChild(tTitle);
		oTip.appendChild(tScroll);
		oTip.appendChild(pScroll);
		oTip.appendChild(tModel);
		oTip.appendChild(pModel);
		oTip.appendChild(tRank);
		oTip.appendChild(pRank);
		 
		oTip.appendChild(reStart);
		game.box.appendChild(oTip);
		game.box.appendChild(author);
		reStart.onclick=game.init;
		
		
	},
	//子弹
	bullet: function(oPlane) {
		var oBullet = document.createElement("img");
		oBullet.className = "Bullet";
		oBullet.src = "img/bullet.png";
		game.box.appendChild(oBullet);
		var planl = parseInt(oPlane.style.left);
		var bT = parseInt(oPlane.style.top) - oPlane.clientWidth / 2;
		oBullet.style.left = planl + oPlane.clientWidth / 2 - oBullet.clientWidth / 2 + "px";
		oBullet.style.top = bT + "px";
		var btMin = -oBullet.clientHeight;
		oBullet.animate = setInterval(function() {
			if (!oBullet.parentNode) {
				clearInterval(oBullet.animate);
				return false;
			}
			bT -= 8;
			if (bT < btMin) {
				bT = btMin;
				oBullet.style.top = bT + "px";
				clearInterval(oBullet.animate);
				oBullet.parentNode.removeChild(oBullet);
			} else {
				oBullet.style.top = bT + "px";
			}
		}, 20)
	}

}
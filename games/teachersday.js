;(function() {
    var $ = require("./common/zepto");
    var Ajax = require("./function/ajax");
    var getquerystring = require("./function/getQueryString");
    var imgChange = require("./function/imgchange");
    var imgchange = new imgChange();

    //共用头部
    var publics = "http://wx.cheertea.com/";
    if(window.location.host == "wx.cheertea.com") {
        publics = "http://wx.cheertea.com/";
    } else if(window.location.host == "test.cheertea.com") {
        publics = "http://test.cheertea.com/";
    } else {
        publics = "http://192.168.2.17:8080/zxxt_qyy/";
    }

    var Teachersday = {
        /*实现分享功能*/
        shareWx: function(ids) {
            var url = location.href;
            var member_id = ids;
            var image_url = "http://images.cheertea.com/teachersdaylogo.png";
            if(member_id != "" && member_id != undefined && member_id != null){
                var shareUrl = 'http://wx.cheertea.com/cn/teachersday.html?memberid=' + member_id;
                $.ajax({
                    type:'POST',
                    url:'http://wx.cheertea.com/widget?type=group_activity&action=ajaxsign&ajax=yes',
                    data:{url:url, member_id:member_id},
                    dataType:"json",
                    success: function(data) {
                        wx.config({
                            debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId : data.appid, // 必填，公众号的唯一标识
                            timestamp : data.timestamp, // 必填，生成签名的时间戳
                            nonceStr :  data.nonceStr, // 必填，生成签名的随机串
                            signature : data.signature,// 必填，签名，见附录1
                            jsApiList : [ 'checkJsApi', 'onMenuShareTimeline',
                                'onMenuShareAppMessage', 'onMenuShareQQ',
                                'onMenuShareQZone' ]
                            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        wx.ready(function(){
                            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                            wx.onMenuShareTimeline({
                                title: "【师恩难忘】教师节趣味游戏——巨柚出品", // 分享标题
                                desc: "我正在玩【师恩难忘】游戏活动,现向您发起挑战, 您敢来应战, 赢取丰厚的礼品吗?", // 分享描述
                                link: shareUrl,
                                imgUrl: image_url , // 分享图标
                                success: function () {
                                    // 用户确认分享后执行的回调函数
                                    $(".isDelete").hide();

                                },
                                cancel: function () {
                                    // 用户取消分享后执行的回调函数
                                }
                            });
                            // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                            wx.onMenuShareAppMessage({
                                title: "【师恩难忘】教师节趣味游戏——巨柚出品", // 分享标题
                                desc: "我正在玩【师恩难忘】游戏活动,现向您发起挑战, 您敢来应战, 赢取丰厚的礼品吗?", // 分享描述
                                link: shareUrl ,
                                imgUrl: image_url, // 分享图标
                                type: data.type, // 分享类型,music、video或link，不填默认为link
                                success: function () {
                                    // 用户确认分享后执行的回调函数
                                    $(".isDelete").hide();

                                },
                                cancel: function () {
                                    // 用户取消分享后执行的回调函数
                                }
                            });

                            //获取“分享到QQ”按钮点击状态及自定义分享内容接口
                            wx.onMenuShareQQ({
                                title: "【师恩难忘】教师节趣味游戏——巨柚出品", // 分享标题
                                desc: "我正在玩【师恩难忘】游戏活动,现向您发起挑战, 您敢来应战, 赢取丰厚的礼品吗?", // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: image_url, // 分享图标
                                success: function () {
                                    // 用户确认分享后执行的回调函数
                                    $(".isDelete").hide();

                                },
                                cancel: function () {
                                    // 用户取消分享后执行的回调函数
                                }
                            });

                            //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
                            wx.onMenuShareQZone({
                                title: "【师恩难忘】教师节趣味游戏——巨柚出品", // 分享标题
                                title: "云海深处，月影难觅。万家灯火，天涯此时。", // 分享描述
                                desc: "我正在玩【师恩难忘】游戏活动,现向您发起挑战, 您敢来应战, 赢取丰厚的礼品吗?", // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: image_url, // 分享图标
                                success: function () {
                                    // 用户确认分享后执行的回调函数
                                    $(".isDelete").hide();

                                },
                                cancel: function () {
                                    // 用户取消分享后执行的回调函数
                                }
                            });
                        });
                        wx.error(function(res){
                            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                            alert("error");
                        });
                    },
                    error: function(){
                        alert("出现错误，连接未成功");
                    }
                })
            }
        },
        /*判断是否登录*/
        isLogin: function() {
            var _this = this;

            //判断用户是否登录
            Ajax({
                urls: "member/login!isLogin.do",
                types: "get",
                asyncs: false,
                // timeouts: 1000 * 10,
                dataTypes: "json",
                successes: function (data) {
                    var datas = JSON.parse(data);

                    if(datas.res_code == 0) {
                        var parentId = getquerystring.init("memberid");
                        if(!!parentId) {
                            var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4868f50223328db&redirect_uri=http%3A%2F%2Fwx.cheertea.com%2Fcn%2Fteachersday.html"
                                +"&response_type=code"
                                +"&scope=snsapi_userinfo"
                                +"&state="+parentId+"#wechat_redirect";

                            window.location.href = url;
                        } else {
                            window.location.href = "/cn/login.html?forward=" + window.location.pathname + window.location.search;
                        }
                    }
                    if(datas.res_code == 1) {
                        //微信分享
                        _this.shareWx(datas.res_data.member.member_id);
                    }
                }
            });
        },
        /*实现tab切换*/
        showRuleTab: function() {
            $(".tabul li").on("touchend", function() {
                $(this).addClass("lisel").siblings(".tabul li").removeClass("lisel");
                $(".conul .cons").eq($(this).index()).addClass("showcons").siblings(".cons").removeClass("showcons");

                //获取邀请数据
                if($(this).index() == 2) {
                    Ajax({
                        urls: "shop/teacheractivity!inviterDetail.do",
                        types: "get",
                        asyncs: false,
                        // timeouts: 1000 * 10,
                        dataTypes: "json",
                        successes: function (data) {
                            var adatas = JSON.parse(data);
                            // console.log(adatas);

                            if(adatas.res_code == 1) {
                                if(adatas.res_data.inviter_list.length > 0) {
                                    $(".awardlistbox").show();
                                    $(".noaward").hide();
                                    $(".awardlist").empty();
                                    $.each(adatas.res_data.inviter_list, function(i) {
                                        $(".awardlist").append(
                                            "<li class='clearfix'>" +
                                                "<span class='awardname'>" + adatas.res_data.inviter_list[i].uname + "</span>" +
                                                "<span>" +
                                                    "<img src='" + adatas.res_data.inviter_list[i].weixin_face + "' alt='' id='awardimg'>" +
                                                "</span>" +
                                                "<span class='invokenum'>" + adatas.res_data.inviter_list[i].inviter_count + "</span>" +
                                                "<span class='drawnum'>" + adatas.res_data.inviter_list[i].draw_count + "</span>" +
                                            "</li>"
                                        );
                                    });
                                } else {
                                    $(".awardlistbox").hide();
                                    $(".noaward").show();
                                }
                            }
                        }
                    });
                }
            });
        },
        /*实现开启关闭规则框*/
        closeRule: function() {
            var _this = this;
            $(".rulebtn").on("touchend", function(event) {
                event.preventDefault();

                $(".showBackbox").show();
                $(".rulebox").show();
                $(".leaderbox").hide();

                $(".rulebox").removeClass("slideOutRight");

                $(".rulebox").addClass("animated slideInRight");
            });

            $(".closebtn").on("touchend", function(event) {
                event.preventDefault();

                if(!_this.bigbox) {
                    $(".rulebox").removeClass("slideInRight");
                    $(".leaderbox").removeClass("slideInRight");

                    $(".rulebox").addClass("animated slideOutRight");
                    $(".leaderbox").addClass("animated slideOutRight");

                    $(".showBackbox").hide();
                    // $(".rulebox").hide();
                    // $(".leaderbox").hide();
                    // console.log(123);
                } else {
                    // console.log(321);
                    _this.bigbox.show();
                    $(".rulebox").removeClass("slideInRight");
                    $(".leaderbox").removeClass("slideInRight");
                    _this.bigbox.removeClass("slideOutRight");

                    $(".rulebox").addClass("animated slideOutRight");
                    $(".leaderbox").addClass("animated slideOutRight");

                    _this.bigbox.addClass("animated slideInRight");
                    // $(".showBackbox").hide();

                    // $(".rulebox").hide();
                    // $(".leaderbox").hide();
                }
            });

            $("#isDeletes").on("touchend", function(event) {
                event.preventDefault();
                $(this).hide();
                _this.bigbox.show();
            });
        },
        /*实现奖品的tab切换*/
        awardTab: function() {
            $(".rewardtab .tit").on("touchend", function() {
                $(this).addClass("titsel").siblings(".tit").removeClass("titsel");
                $(".rewardcon .con").eq($(this).index()).addClass("consel").siblings(".con").removeClass("consel");
            });
        },
        /*切换奖品区*/
        changeAward: function() {
            var _this = this;

            $(".actprize").on("touchend", function() {
                $(this).addClass("add1");
                $(".myprize").removeClass("add2");
                $(".rewardbox").show();
                $(".randombox").hide();

                /*获取排名中奖列表*/
                _this.getAwardAjax(1);

                /*获取随机中奖列表*/
                _this.getAwardAjax(2);

            });

            $(".myprize").on("touchend", function() {
                $(this).addClass("add2");
                $(".actprize").removeClass("add1");
                $(".rewardbox").hide();
                $(".randombox").show();

                //获取我的奖品
                Ajax({
                    urls: "shop/teacheractivity!showOwnReward.do",
                    types: "get",
                    dataTypes: "json",
                    successes: function (data) {
                        var imgs = null;
                        var cpns_names = " ";
                        var imgnames = "";
                        var smallname = "";
                        var delname = "";
                        var datas = JSON.parse(data);
                        // console.log(datas);
                        $(".randombox").empty();
                        $.each(datas.res_data.list, function(i) {

                            //添加图片
                            if(datas.res_data.list[i].goods_id == 1) {
                                imgs = "http://images.cheertea.com/huodong1.png";
                                cpns_names = datas.res_data.list[i].cpns_name;
                                imgnames = (datas.res_data.reward_list[i].cpns_name).split("（")[0];
                                smallname = imgnames.split("元")[0] + "元";
                                delname = imgnames.split("元")[1];
                            } else if(datas.res_data.list[i].goods_id == 2) {
                                imgs = "http://images.cheertea.com/huodong2.png";
                                cpns_names = datas.res_data.list[i].cpns_name;
                                imgnames = (datas.res_data.reward_list[i].cpns_name).split("（")[0];
                                smallname = imgnames.split("元")[0] + "元";
                                delname = imgnames.split("元")[1];
                            } else {
                                imgs = datas.res_data.list[i].img_url;
                                cpns_names = " ";
                            }

                            $(".randombox").append(
                                "<dl class='voucher clearfix' ids='" + datas.res_data.list[i].cpns_id + "'>" +
                                    "<a href='http://wx.cheertea.com'>" +
                                        "<dt class='imgbox'>" +
                                            "<img src='" + imgchange.show(imgs) + "' alt=''>" +
                                        "</dt>" +
                                        "<dd class='rightcon'>" +
                                            "<p class='name'>" + datas.res_data.list[i].reward_name + "</p>" +
                                            "<p class='name'>" + cpns_names + "</p>" +
                                            "<p class='picprice'>" + smallname + "</p>" +
                                            "<p class='price'>" + delname + "</p>" +
                                        "</dd>" +
                                    "</a>" +
                                "</dl>"
                            );
                        });
                    }
                });
            });
        },
        /*显示排行榜*/
        showLeadbox: function() {
            $(".leadbtn").on("touchend", function() {
                // slideInRight
                $(".showBackbox").show();
                $(".leaderbox").show();
                $(".rulebox").hide();
                $(".leaderbox").removeClass("slideOutRight");

                $(".leaderbox").addClass("animated slideInRight");

                //获取排行榜数据
                Ajax({
                    urls: "shop/teacheractivity!showRank.do",
                    types: "get",
                    dataTypes: "json",
                    successes: function (data) {
                        var datas = JSON.parse(data);
                        // console.log(datas);

                        if(datas.res_code == 1) {
                            $(".topofscore .scorenum").html(datas.res_data.big_number);
                            $(".topofscore .alllead").html(datas.res_data.own_rank);

                            $(".firstbox").empty();
                            $.each(datas.res_data.list, function(i) {
                                $(".firstbox").append(
                                    "<li class='clearfix'>" +
                                        "<span class='num'>No." + (i + 1) + "</span>" +
                                        "<img src='" + datas.res_data.list[i].weixin_face + "' alt='' class='imgboxs'>" +
                                        "<div class='rightcons'>" +
                                            "<p class='names'>" + datas.res_data.list[i].uname + "</p>" +
                                            "<p class='details'>玩了<span class='nums'>" + datas.res_data.list[i].play_count + "</span>次，最高纪录<span class='topnum'>" + datas.res_data.list[i].number + "</span>个</p>" +
                                        "</div>" +
                                    "</li>"
                                );
                            });
                        }
                    }
                });
            });
        },
        // /*切换排行榜*/
        // changeLeaderbox: function() {
        //     $(".leadtab .first").on("touchend", function() {
        //         $(this).addClass("firstsel");
        //         $(".firstbox").show();
        //         $(".secondbox").hide();
        //         $(".leadtab .second").removeClass("secondsel");
        //     });
        //
        //     $(".leadtab .second").on("touchend", function() {
        //         $(this).addClass("secondsel");
        //         $(".secondbox").show();
        //         $(".firstbox").hide();
        //         $(".leadtab .first").removeClass("firstsel");
        //     });
        // },
        /*弹出商品页面*/
        showBtn: function() {
            var _this = this;

            $(".leftbox").on("touchend", function(event) {
                event.preventDefault();
                $(".bigcelebratebox").hide();
                $(".bigshamebox").hide();
                $(".rulebox").show();
                $(".tabul li").eq(1).addClass("lisel").siblings(".tabul li").removeClass("lisel");
                $(".conul .cons").eq(1).addClass("showcons").siblings(".cons").removeClass("showcons");
                $(".myprize").removeClass("add2");
                $(".actprize").addClass("add1");
                $(".rewardbox").show();
                $(".randombox").hide();

                $(".rulebox").removeClass("slideOutRight");
                $(".rulebox").addClass("animated slideInRight");

                /*获取排名中奖列表*/
                _this.getAwardAjax(1);

                /*获取随机中奖列表*/
                _this.getAwardAjax(2);
            });

            $(".rightbox").on("touchend", function(event) {
                event.preventDefault();
                $(".bigcelebratebox").hide();
                $(".bigshamebox").hide();
                $(".rulebox").show();
                $(".tabul li").eq(1).addClass("lisel").siblings(".tabul li").removeClass("lisel");
                $(".conul .cons").eq(1).addClass("showcons").siblings(".cons").removeClass("showcons");
                $(".myprize").addClass("add2");
                $(".actprize").removeClass("add1");
                $(".rewardbox").hide();
                $(".randombox").show();

                $(".rulebox").removeClass("slideOutRight");
                $(".rulebox").addClass("animated slideInRight");

                /*获取排名中奖列表*/
                _this.getAwardAjax(1);

                /*获取随机中奖列表*/
                _this.getAwardAjax(2);

                //获取我的奖品列表
                Ajax({
                    urls: "shop/teacheractivity!showOwnReward.do",
                    types: "get",
                    dataTypes: "json",
                    successes: function (data) {
                        var imgs = null;
                        var cpns_names = " ";
                        var imgnames = "";
                        var smallname = "";
                        var delname = "";
                        var datas = JSON.parse(data);
                        // console.log(datas);
                        $(".randombox").empty();
                        $.each(datas.res_data.list, function(i) {

                            //添加图片
                            if(datas.res_data.list[i].goods_id == 1) {
                                imgs = "http://images.cheertea.com/huodong1.png";
                                cpns_names = datas.res_data.list[i].cpns_name;
                                imgnames = (datas.res_data.reward_list[i].cpns_name).split("（")[0];
                                smallname = imgnames.split("元")[0] + "元";
                                delname = imgnames.split("元")[1];
                            } else if(datas.res_data.list[i].goods_id == 2) {
                                imgs = "http://images.cheertea.com/huodong2.png";
                                cpns_names = datas.res_data.list[i].cpns_name;
                                imgnames = (datas.res_data.reward_list[i].cpns_name).split("（")[0];
                                smallname = imgnames.split("元")[0] + "元";
                                delname = imgnames.split("元")[1];
                            } else {
                                imgs = datas.res_data.list[i].img_url;
                                cpns_names = " ";
                            }

                            $(".randombox").append(
                                "<dl class='voucher clearfix' ids='" + datas.res_data.list[i].cpns_id + "'>" +
                                    "<a href='http://wx.cheertea.com'>" +
                                    "<dt class='imgbox'>" +
                                        "<img src='" + imgchange.show(imgs) + "' alt=''>" +
                                    "</dt>" +
                                    "<dd class='rightcon'>" +
                                        "<p class='name'>" + datas.res_data.list[i].reward_name + "</p>" +
                                        "<p class='name'>" + cpns_names + "</p>" +
                                        "<p class='picprice'>" + smallname + "</p>" +
                                        "<p class='price'>" + delname + "</p>" +
                                    "</dd>" +
                                    "</a>" +
                                "</dl>"
                            );
                        });
                    }
                });
            });

            /*点击出现排行榜*/
            $(".newleadbtn").on("touchend", function() {
                $(".bigcelebratebox").hide();
                $(".bigshamebox").hide();
                $(".leaderbox").show();

                $(".leaderbox").removeClass("slideOutRight");
                $(".leaderbox").addClass("animated slideInRight");

                //获取排行榜数据
                Ajax({
                    urls: "shop/teacheractivity!showRank.do",
                    types: "get",
                    dataTypes: "json",
                    successes: function (data) {
                        var datas = JSON.parse(data);
                        // console.log(datas);

                        if(datas.res_code == 1) {
                            $(".topofscore .scorenum").html(datas.res_data.big_number);
                            $(".topofscore .alllead").html(datas.res_data.own_rank);

                            $(".firstbox").empty();
                            $.each(datas.res_data.list, function(i) {
                                $(".firstbox").append(
                                    "<li class='clearfix'>" +
                                    "<span class='num'>No." + (i + 1) + "</span>" +
                                    "<img src='" + datas.res_data.list[i].weixin_face + "' alt='' class='imgboxs'>" +
                                    "<div class='rightcons'>" +
                                    "<p class='names'>" + datas.res_data.list[i].uname + "</p>" +
                                    "<p class='details'>玩了<span class='nums'>" + datas.res_data.list[i].play_count + "</span>次，最高纪录<span class='topnum'>" + datas.res_data.list[i].number + "</span>个</p>" +
                                    "</div>" +
                                    "</li>"
                                );
                            });
                        }
                    }
                });
            });

            /*显示分享框*/
            $(".findfriends").on("touchend", function() {
                $(".bigcelebratebox").hide();
                $(".bigshamebox").hide();
                $("#isDeletes").show();
            });
        },
        /*设计倒计时*/
        countDown: function(number) {
            var _this = this;

            $(".maintitle .countdown").html((number / 100).toFixed(2));
            this.timers = setInterval(function() {
                number--;
                $(".maintitle .countdown").html((number / 100).toFixed(2));
                if(number <= 0) {
                    number = 0;
                    $(".maintitle .countdown").html((number / 100).toFixed(2));

                    clearInterval(_this.timers);
                    // clearInterval(_this.timer);

                    //根据不同的分数，弹出不同的弹窗
                    $(".showBackbox").show();
                    if(_this.score >= 10) {
                        $(".smallcelebratebox").show();

                        $(".smallcelebratebox").removeClass("slideOutRight");
                        $(".smallcelebratebox").addClass("animated slideInRight");
                    } else {
                        $(".smallshamebox").show();

                        $(".smallshamebox").removeClass("slideOutRight");
                        $(".smallshamebox").addClass("animated slideInRight");
                    }

                    //将数据传递给后台
                    Ajax({
                        urls: "shop/teacheractivity!endGame.do",
                        types: "get",
                        dataTypes: "json",
                        datas: {
                            play_num: $(".totalscore span").html()
                        },
                        successes: function (data) {
                            var datas = JSON.parse(data);
                            // console.log(datas);
                            $(".lastnumber .have").html(datas.res_data.day_remain_draw_count);
                            $(".gradebox .grade").html(datas.res_data.play_num);
                            $(".gradebox .newnum").html(datas.res_data.percent);
                            $(".gradebox .top").html(datas.res_data.big_number);
                            $(".gradebox .actlead").html(datas.res_data.own_rank);
                            $(".smallcelebratebox").on("touchend", ".smallbtn", function() {
                                _this.bigbox = $(".bigcelebratebox");
                                if(datas.res_data.day_remain_draw_count > 0) {
                                    $("#drawwrap").show();

                                    //传递抽奖数据
                                    Ajax({
                                        urls: "shop/teacheractivity!doLottery.do",
                                        types: "get",
                                        dataTypes: "json",
                                        successes: function (data) {
                                            var datass = JSON.parse(data);
                                            // console.log(datass);

                                            /*实现转盘内容*/
                                            _this.drawSelection(datass.res_data.is_win, datass.res_data.reward_result);
                                        }
                                    });
                                } else {
                                    alert("没有抽奖次数");
                                }
                                $(".smallcelebratebox").off("touchend", ".smallbtn");
                            });
                        }
                    });
                }
            }, 10);
        },
        /*设置参数*/
        setSetting: function(indexs) {
            var _this = this;

            // /*持续往后运动(更新成一个计时器)*/
            // this.timer = setInterval(function() {
            for(var i = 0; i < indexs; i++) {
                if(!!$(".mainbox").eq(i).children().hasClass("role")) {
                    _this.posY[i] += _this.posYSpeed;
                    if(_this.posY[i] >= _this.endY) {
                        _this.posY[i] = _this.endY;
                        _this.posX[i] = _this.posX[i] - _this.speeds;

                        /*游戏结束*/
                        if(_this.posX[i] < 0) {
                            // console.log(i)
                            clearInterval(_this.timers);
                            clearInterval(_this.timer);
                            for(var j = 0; j < indexs; j++) {

                                //清空所有快
                                $(".mainbox").eq(j).empty();
                            }

                            //根据不同的分数，弹出不同的弹窗
                            $(".showBackbox").show();
                            if(_this.score >= 10) {
                                $(".smallcelebratebox").show();

                                $(".smallcelebratebox").removeClass("slideOutRight");
                                $(".smallcelebratebox").addClass("animated slideInRight");
                            } else {
                                $(".smallshamebox").show();

                                $(".smallshamebox").removeClass("slideOutRight");
                                $(".smallshamebox").addClass("animated slideInRight");
                            }

                            //将数据传递给后台
                            Ajax({
                                urls: "shop/teacheractivity!endGame.do",
                                types: "get",
                                dataTypes: "json",
                                datas: {
                                    play_num: $(".totalscore span").html()
                                },
                                successes: function (data) {
                                    var datas = JSON.parse(data);
                                    // console.log(datas);
                                    $(".lastnumber .have").html(datas.res_data.day_remain_draw_count);
                                    $(".gradebox .grade").html(datas.res_data.play_num);
                                    $(".gradebox .newnum").html(datas.res_data.percent);
                                    $(".gradebox .top").html(datas.res_data.big_number);
                                    $(".gradebox .actlead").html(datas.res_data.own_rank);
                                    $(".smallcelebratebox").on("touchend", ".smallbtn", function() {
                                        _this.bigbox = $(".bigcelebratebox");
                                        if(datas.res_data.day_remain_draw_count > 0) {
                                            $("#drawwrap").show();

                                            //传递抽奖数据
                                            Ajax({
                                                urls: "shop/teacheractivity!doLottery.do",
                                                types: "get",
                                                dataTypes: "json",
                                                successes: function (data) {
                                                    var datass = JSON.parse(data);
                                                    // console.log(datass);
                                                    // console.log(datass.res_data.reward_result)
                                                    /*实现转盘内容*/
                                                    _this.drawSelection(datass.res_data.is_win, datass.res_data.reward_result);
                                                }
                                            });
                                        } else {
                                            alert("没有抽奖次数");
                                        }
                                        $(".smallcelebratebox").off("touchend", ".smallbtn");
                                    });
                                }
                            });
                        }
                    }
                    $(".mainbox").eq(i).find(".role").css({
                        transform: "translate3d(" + _this.posX[i] + "rem, " + _this.posY[i] + "%, 0)"
                    });
                }
            }
            // }, 16);
        },
        /*点击的时候当前添加距离*/
        addPosX: function(secondScore, thirdScore) {
            var _this = this;

            $(".mainbox").on("touchend", function() {
                if(_this.posY[$(this).index()] >= _this.endY) {
                    _this.posX[$(this).index()] += (_this.speeds * 50);

                    //当学生到达posX为6的时候, 取消该块, 分数增加1
                    if(_this.posX[$(this).index()] >= 6) {
                        _this.score += 2;

                        //添加其他块的学生
                        if(_this.score > secondScore) {
                            if(!($(".mainbox").eq(1).find(".role")).length) {
                                $(".mainbox").eq(1).append("<div class='role'></div>");
                            }
                        }

                        if(_this.score > thirdScore) {
                            if(!($(".mainbox").eq(2).find(".role")).length) {
                                $(".mainbox").eq(2).append("<div class='role'></div>");
                            }
                        }

                        $(".totalscore span").html(_this.score);
                        $(this).find(".role").remove();
                        // clearInterval(_this.timer);

                        //初始化数据
                        _this.posX[$(this).index()] = 2;
                        _this.posY[$(this).index()] = 0;

                        $(this).find(".role").css({
                            transform: "translate3d(" + _this.posX[$(this).index()] + "rem, " + _this.posY[$(this).index()] + "%, 0)"
                        });
                        $(this).append("<div class='role'></div>");
                    }
                }
            });
        },
        /*小弹窗功能*/
        smallBox: function() {
            var _this = this;

            $(".smallshamebox").on("touchend", ".newchacha", function(event) {
                _this.bigbox = $(".bigshamebox");
                event.preventDefault();
                $(".smallshamebox").hide();
                $(".smallshamebox").removeClass("animated slideInRight");
                $(".bigshamebox").show();

                $(".smallshamebox").removeClass("animated slideOutRight");
                $(".bigshamebox").addClass("animated slideInRight");
            });

            $(".smallcelebratebox").on("touchend", ".newchacha", function(event) {
                _this.bigbox = $(".bigcelebratebox");
                event.preventDefault();
                $(".smallcelebratebox").hide();
                $(".bigcelebratebox").show();
            });
        },
        /*重新开始*/
        againBtn: function() {
            var _this = this;

            $(".againbtn").on("touchend", function() {

                //初始化数据
                for(var i = 0; i < 3; i++) {
                    $(".mainbox").eq(i).empty();
                }
                _this.score = 0;
                $(".totalscore span").html(_this.score);
                _this.posX = [];
                _this.posY = [];

                for(var i = 0; i < 3; i++) {
                    _this.posX[i] = 2
                    _this.posY[i] = 0;
                }

                $(".showBackbox").hide();
                _this.bigbox.hide();
                _this.bigbox = null;
                /**
                 * speed 速度
                 */
                clearInterval(_this.timer);
                _this.timer = setInterval(function() {
                    _this.setSetting(3);
                }, 16);

                //增加第一个块的学生
                $(".mainbox").eq(0).append("<div class='role'></div>");

                /*设计倒计时*/
                _this.countDown(6000);
            });
        },
        /*实现转盘内容*/
        drawSelection: function(numbers, newdata) {

            //随机放置奖品
            var randomSum = Math.floor(Math.random() * 9);
            (randomSum == 4) && (randomSum = randomSum - 1);
            $(".getPrizebox li").eq(randomSum).addClass("addli").siblings("li").removeClass("addli");

            //旋转转盘
            var drawtimes = 1;
            var speed = 20;
            var indexs = -1;
            var other = 0;
            var drawTimer1 = null;

            function show() {
                if(indexs >= -1 && indexs < 2) {
                    indexs++;
                    $(".getPrizebox li").eq(indexs).addClass("showli").siblings("li").removeClass("showli");
                } else if(((indexs + 1) % 3) == 0 && !other) {
                    indexs += 3;
                    $(".getPrizebox li").eq(indexs).addClass("showli").siblings("li").removeClass("showli");
                    (indexs == 8) && (other = 1);
                } else if(indexs > 6 && indexs <= 8) {
                    indexs--;
                    other = 0;
                    $(".getPrizebox li").eq(indexs).addClass("showli").siblings("li").removeClass("showli");
                } else if(indexs % 3 == 0) {
                    indexs -= 3;
                    (indexs < 0) && (indexs = 0);
                    $(".getPrizebox li").eq(indexs).addClass("showli").siblings("li").removeClass("showli");
                }
                drawtimes += speed;

                drawTimer1 = setTimeout(function() {
                    show();
                }, drawtimes);

                if(drawtimes >= 300) {
                    if(numbers == 1) {
                        if(indexs == randomSum) {
                            setTimeout(function() {
                                $(".showPrizebox").show();
                                $(".prizethings").html(newdata.split("(")[0]);
                                $(".prizedetail").html("(" + newdata.split("(")[1]);
                            }, 1000);
                            clearTimeout(drawTimer1);

                            setTimeout(function() {
                                $("#drawwrap").hide();
                                $(".showPrizebox").hide();
                                $(".smallcelebratebox").hide();
                                $(".bigcelebratebox").show();
                            }, 6000);
                        }
                    } else {
                        if(indexs != randomSum) {
                            clearTimeout(drawTimer1);

                            setTimeout(function() {
                                $("#drawwrap").hide();
                                $(".smallcelebratebox").hide();
                                $(".bigcelebratebox").show();
                            }, 3000);
                        }
                    }
                }
            }
            drawTimer1 = setTimeout(function() {
                show();
            }, drawtimes);
        },
        /*奖品数据接口*/
        getAwardAjax: function(nums) {

            //获取奖品列表
            Ajax({
                urls: "shop/teacheractivity!showReward.do",
                types: "get",
                dataTypes: "json",
                datas: {
                    reward_type: nums
                },
                successes: function (data) {
                    var imgs = null;
                    var cpns_names = " ";
                    var imgnames = "";
                    var smallname = "";
                    var delname = "";
                    var datas = JSON.parse(data);
                    // console.log(datas);

                    $(".rewardcon .con").eq(nums - 1).empty();
                    $.each(datas.res_data.reward_list, function(i) {

                        //添加图片
                        if(datas.res_data.reward_list[i].goods_id == 1) {
                            imgs = "http://images.cheertea.com/daijinquan1.png";
                            cpns_names = datas.res_data.reward_list[i].cpns_name;
                            imgnames = (datas.res_data.reward_list[i].cpns_name).split("（")[0];
                            smallname = imgnames.split("元")[0] + "元";
                            delname = imgnames.split("元")[1];
                        } else if(datas.res_data.reward_list[i].goods_id == 2) {
                            imgs = "http://images.cheertea.com/daijinquan2.png";
                            cpns_names = datas.res_data.reward_list[i].cpns_name;
                            imgnames = (datas.res_data.reward_list[i].cpns_name).split("（")[0];
                            smallname = imgnames.split("元")[0] + "元";
                            delname = imgnames.split("元")[1];
                        } else {
                            imgs = datas.res_data.reward_list[i].img_url;
                            cpns_names = " ";
                        }

                        $(".rewardcon .con").eq(nums - 1).append(
                            "<dl class='voucher clearfix' ids='" + datas.res_data.reward_list[i].cpns_id + "'>" +
                                "<a href='http://wx.cheertea.com'>" +
                                    "<dt class='imgbox'>" +
                                        "<img src='" + imgchange.show(imgs) + "' alt=''>" +
                                    "</dt>" +
                                    "<dd class='rightcon'>" +
                                        "<p class='name'>" + datas.res_data.reward_list[i].reward_name + "</p>" +
                                        "<p class='name'>" + cpns_names + "</p>" +
                                        "<p class='picprice'>" + smallname + "</p>" +
                                        "<p class='price'>" + delname + "</p>" +
                                    "</dd>" +
                                "</a>" +
                            "</dl>"
                        );
                    });
                }
            });
        },
        /*开始游戏*/
        startGame: function() {
            this.timer = [];
            this.score = 0;

            //初始化数据
            this.posX = [];
            this.posY = [];
            for(var i = 0; i < 3; i++) {
                this.posX[i] = 2;
                this.posY[i] = 0;
            }

            this.speeds = 0.02;
            this.posYSpeed = 2.2;

            var _this = this;

            $(".startbtn").on("tap", function() {
                $(".teachertitlebgbox").hide();
                $("#teachersdaywrap").hide();
                $("#teachersdaystart").show();
                $("#logobox").hide();

                /**
                 * speed 速度
                 */
                _this.timer = setInterval(function() {
                    _this.setSetting(3);
                }, 16);

                //增加第一个块的学生
                $(".mainbox").eq(0).append("<div class='role'></div>");

                /*设计倒计时*/
                _this.countDown(6000);
            });

            /*增加移动距离*/
            this.addPosX(4, 12);
        },
        /*初始化ajax*/
        initAjax: function() {

            //首页接口
            Ajax({
                urls: "shop/teacheractivity!initGame.do",
                types: "get",
                dataTypes: "json",
                successes: function (data) {
                    var datas = JSON.parse(data);
                    // console.log(datas);

                    //添加头部
                    $('.teachertitlebgbox').addClass('animated zoomInDown');
                }
            });
        },
        /*添加音乐*/
        addAudio: function() {
            wx.config({
                // 配置信息, 即使不正确也能使用 wx.ready
                debug: false,
                appId: '',
                timestamp: 1,
                nonceStr: '',
                signature: '',
                jsApiList: []
            });
            wx.ready(function() {
                $("#audiobox audio")[0].play();
            });

            $("#audiobox").on("click", function(event) {
                // console.log(1);
                event.preventDefault();
                if($("#audiobox").hasClass("removeaudio")) {
                    $(this).removeClass("removeaudio");
                    $("#audiobox audio")[0].play();
                } else {
                    $(this).addClass("removeaudio");
                    $("#audiobox audio")[0].pause();
                }
            });
        },
        init: function() {
            //判断是否为苹果还是安卓机
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

            if(isAndroid) {
                this.endY = 80;
                $(".otherbtn").css({
                    top: "89% !important"
                });

                $(".againbtn").css({
                    top: "10.2rem !important"
                });

                $(".prizebox").css({
                    top: "8.3rem !important"
                });
            } else if(isiOS) {
                this.endY = 100;
            }

            //阻止默认事件
            $("#teachersdaywrap").on("touchmove", function(event) {
                event.preventDefault();
            });

            $("#teachersdaystart").on("touchmove", function(event) {
                event.preventDefault();
            });

            $(".showBackbox").on("touchmove", function(event) {
                event.preventDefault();
            });

            $(".teachertitlebgbox").on("touchmove", function(event) {
                event.preventDefault();
            });

            $(".leaderbox").on("touchmove", function(event) {
                if(!$(event.target).parents().hasClass("leadconbox")) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });

            $(".smallshamebox").on("touchmove", function(event) {
                event.preventDefault();
            });

            $(".smallcelebratebox").on("touchmove", function(event) {
                event.preventDefault();
            });

            $(".bigcelebratebox").on("touchmove", function(event) {
                event.preventDefault();
            });

            $(".bigshamebox").on("touchmove", function(event) {
                event.preventDefault();
            });

            $(".conul").on("touchmove", function(event) {
                if($(event.target).parents().hasClass("rewardbox") || $(event.target).parents().hasClass("randombox") || $(event.target).parents().hasClass("awardlistbox")) {

                } else {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });

            //获取当前大弹窗
            this.bigbox = null;

            /*实现登录*/
            this.isLogin();

            /*实现tab切换*/
            this.showRuleTab();

            /*开启关闭规则框*/
            this.closeRule();

            /*实现奖品的兑换*/
            this.awardTab();

            /*切换奖品区*/
            this.changeAward();

            /*显示排行榜*/
            this.showLeadbox();

            // /*切换排行榜*/
            // this.changeLeaderbox();

            /*弹出商品页面*/
            this.showBtn();

            /*开始游戏*/
            this.startGame();

            /*小弹窗功能*/
            this.smallBox();

            /*重新开始游戏*/
            this.againBtn();

            /*初始化游戏*/
            this.initAjax();

            /*获取排名中奖列表*/
            this.getAwardAjax(1);

            /*获取随机中奖列表*/
            this.getAwardAjax(2);

            /*添加音乐*/
            this.addAudio();
        }
    }
    Teachersday.init();
})();

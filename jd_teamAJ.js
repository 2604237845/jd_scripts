/*
组队分豆-安佳 [jd_teamAJ.js]

————————————————
入口：[组队分豆-安佳]
IOS等用户直接用NobyDa的jd cookie
============Quantumultx===============
[task_local]
#组队分豆-安佳
1 1 1 1 * https://raw.githubusercontent.com/KingRan/KR/main/jd_teamAJ.js, tag=组队分豆-安佳, enabled=true
================Loon==============
[Script]
cron "1 1 1 1 *" script-path=https://raw.githubusercontent.com/KingRan/KR/main/jd_teamAJ.js,tag=组队分豆-安佳
===============Surge=================
组队分豆-安佳 = type=cron,cronexp="1 1 1 1 *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/KingRan/KR/main/jd_teamAJ.js
============小火箭=========
组队分豆-安佳 = type=cron,script-path=https://raw.githubusercontent.com/KingRan/KR/main/jd_teamAJ.js, cronexpr="1 1 1 1 *", timeout=3600, enable=true
*/
const Env=require('./utils/Env.js');
const $=new Env("安佳组队分豆-加密");
const jdCookieNode=$.isNode()?require('./jdCookie.js'):'';
const notify=$.isNode()?require('./sendNotify'):'';
const getToken=require('./function/krgetToken');
let domains='https://lzkjdz-isv.isvjcloud.com';
let cookiesArr=[],cookie='',message='';
let ownCode=null;
let activityCookie='';
lz_cookie={};
if($.isNode()){
	Object.keys(jdCookieNode)['forEach'](_0x1fb11e=>{
		cookiesArr.push(jdCookieNode[_0x1fb11e]);
	});
	if(process.env['JD_DEBUG']&&process.env['JD_DEBUG']==='false')console.log=()=>{};
}else{
	let cookiesData=$.getdata('CookiesJD')||'[]';
	cookiesData=JSON.parse(cookiesData);
	cookiesArr=cookiesData.map(_0xdb3e9c=>_0xdb3e9c.cookie);
	cookiesArr.reverse();
	cookiesArr.push(...[$.getdata('CookieJD2'),$.getdata('CookieJD')]);
	cookiesArr.reverse();
	cookiesArr=cookiesArr.filter(_0x1be6c4=>!!_0x1be6c4);
}
!(async()=>{
	if(!cookiesArr[0]){
		$.msg($.name,'【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取','https://bean.m.jd.com/bean/signIndex.action',{'open-url':'https://bean.m.jd.com/bean/signIndex.action'});
		return;
	}
	authorCodeList=[]//await getAuthorCodeList('http://code.kingran.ga/aj.json');
	console.log('\n此活动需要新加入会员店铺才能加入队伍，\n若已经入会过，则无法重复入队，\n瓜分限制20组，请自行换号运行。\n瓜分入口:\nhttps://lzkjdz-isv.isvjcloud.com/pool/captain/4471266?activityId=5280930d84294555b7a1e61cb97ce9de');
	for(let _0x296f2c=0;_0x296f2c<cookiesArr.length;_0x296f2c++){
		if(cookiesArr[_0x296f2c]){
			cookie=cookiesArr[_0x296f2c];
			originCookie=cookiesArr[_0x296f2c];
			newCookie='';
			$.UserName=decodeURIComponent(cookie.match(/pt_pin=(.+?);/)&&cookie.match(/pt_pin=(.+?);/)[1]);
			$.index=_0x296f2c+1;
			$.isLogin=true;
			$.nickName='';
			await checkCookie();
			console.log('\n******开始【京东账号'+$.index+'】'+($.nickName||$.UserName)+'*********\n');
			if(!$.isLogin){
				$.msg($.name,'【提示】cookie已失效','京东账号'+$.index+' '+($.nickName||$.UserName)+'\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action',{'open-url':'https://bean.m.jd.com/bean/signIndex.action'});
				if($.isNode()){
					await notify.sendNotify($.name+'cookie已失效 - '+$.UserName,'京东账号'+$.index+' '+$.UserName+'\n请重新登录获取cookie');
				}
				continue;
			}
			$.ADID=getUUID('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',1);
			$.UUID=getUUID('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
			$.authorCode=ownCode?ownCode:authorCodeList[random(0,authorCodeList.length)];
			$.authorNum=''+random(1000000,9999999);
			$.activityId='5280930d84294555b7a1e61cb97ce9de';
			$.activityShopId='1000014486';
			$.activityUrls='https://lzkjdz-isv.isvjcloud.com/';
			$.activityUrl='https://lzkjdz-isv.isvjcloud.com/pool/captain/'+$.authorNum+'?activityId='+$.activityId+'&signUuid='+encodeURIComponent($.authorCode)+'&adsource=null&shareuserid4minipg=null&shopid='+$.activityShopId+'&lng=00.000000&lat=00.000000&sid=&un_area=';
			await getUA();
			await aj();
			await $.wait(3000);
		}
	}
	if(message!==''){
		if($.isNode()){
			await notify.sendNotify($.name,message,'','\n');
		}else{
			$.msg($.name,'有点儿收获',message);
		}
	}
})()['catch'](_0x5695e9=>{
	$.log('','❌ '+$.name+', 失败! 原因: '+_0x5695e9+'!','');
})['finally'](()=>{
	$.done();
});
async function aj(){
	$.token=null;
	$.secretPin=null;
	$.openCardActivityId=null;
	await getFirstLZCK();
	$.token=await getToken(cookie,domains);
	if($.token==''){
		console.log('获取[token]失败！');
		return;
	}
	await task('customer/getSimpleActInfoVo','activityId='+$.activityId);
	await $.wait(2000);
	if($.token){
		await getMyPing();
		if($.secretPin){
			console.log('加入队伍：'+$.authorCode);
			await task('common/accessLogWithAD','venderId='+$.activityShopId+'&code=46&pin='+encodeURIComponent($.secretPin)+'&activityId='+$.activityId+'&pageUrl='+$.activityUrl+'&subType=app&adSource=null');
			await $.wait(2000);
			await task('pool/activityContent','activityId='+$.activityId+'&pin='+encodeURIComponent($.secretPin)+'&signUuid='+encodeURIComponent($.authorCode));
			if($.activityContent){
				if($.activityContent['canJoin']){
					$.log('加入队伍成功，请等待队长瓜分京豆');
					await $.wait(2000);
					await task('pool/saveCandidate','activityId='+$.activityId+'&pin='+encodeURIComponent($.secretPin)+'&signUuid='+encodeURIComponent($.authorCode)+'&pinImg='+encodeURIComponent('https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg'));
					$.log('加入会员');
					$.errorJoinShop='';
					await joinShop();
					if($.errorJoinShop['indexOf']('活动太火爆，请稍后再试')>-1){
						console.log('尝试第一次 重新开卡');
						await $.wait(500);
						await joinShop();
					}
					if($.errorJoinShop['indexOf']('活动太火爆，请稍后再试')>-1){
						console.log('尝试第二次 重新开卡');
						await $.wait(500);
						await joinShop();
					}
					if($.errorJoinShop['indexOf']('活动太火爆，请稍后再试')>-1){
						console.log('尝试第三次 重新开卡');
						await $.wait(500);
						await joinShop();
					}
					if($.errorJoinShop['indexOf']('活动太火爆，请稍后再试')>-1){
						console.log('抱歉，开卡不成功 ，请重新运行脚本');
					}
					await $.wait(2000);
					await task('pool/activityContent','activityId='+$.activityId+'&pin='+encodeURIComponent($.secretPin)+'&signUuid='+encodeURIComponent($.authorCode));
					await $.wait(2000);
					if($.index===1){
						if($.activityContent['canCreate']){
							$.log('创建队伍');
							await $.wait(2000);
							await task('pool/saveCaptain','activityId='+$.activityId+'&pin='+encodeURIComponent($.secretPin)+'&pinImg='+encodeURIComponent('https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg'));
							console.log('队伍ID：'+ownCode);
						}
					}
				}else{
					if($.index===1){
						$.log('创建队伍');
						if($.activityContent['canCreate']){
							await $.wait(2000);
							await task('pool/saveCaptain','activityId='+$.activityId+'&pin='+encodeURIComponent($.secretPin)+'&pinImg='+encodeURIComponent('https://img10.360buyimg.com/imgzone/jfs/t1/21383/2/6633/3879/5c5138d8E0967ccf2/91da57c5e2166005.jpg'));
							console.log('队伍ID：'+ownCode);
						}else{
							ownCode=$.activityContent['signUuid'];
							console.log('队伍ID：'+ownCode);
						}
					}else{
						$.log('你已经是店铺会员了，无法加入队伍！');
					}
				}
			}
		}else{
			$.log('没有成功获取到用户信息');
		}
	}else{
		$.log('没有成功获取到用户鉴权信息');
	}
}
function task(_0x48d191,_0x4c85ac){
	return new Promise(_0x4ff4f0=>{
		$.post(taskUrl(_0x48d191,_0x4c85ac),async(_0x1e05ec,_0x2eb9b4,_0x430622)=>{
			try{
				if(_0x1e05ec){
					$.log(_0x1e05ec);
				}else{
					setActivityCookie(_0x2eb9b4);
					if(_0x430622){
						_0x430622=JSON.parse(_0x430622);
						if(_0x430622.result){
							switch(_0x48d191){
								case 'pool/saveCaptain':
									if(_0x430622.data['signUuid']){
										$.log('创建队伍成功');
										if($.index===1){
											ownCode=_0x430622.data['signUuid'];
										}
									}
									break;
								case 'common/getSimpleActInfoVo':
									$.jdActivityId=_0x430622.data['jdActivityId'];
									$.venderId=_0x430622.data['venderId'];
									break;
								case 'wxActionCommon/getUserInfo':
									$.nickname=_0x430622.data['nickname'];
									$.pinImg='https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png';
									break;
								case 'pool/activityContent':
									$.activityContent=_0x430622.data;
									$.openCard=_0x430622.data['openCard'];
									if($.index===1){
										ownCode=_0x430622.data['signUuid'];
									}
									break;
								case 'pool/updateCaptain':
									console.log(_0x430622.data);
									break;
								default:
									break;
							}
						}else{
							$.log(JSON.stringify(_0x430622));
						}
					}else{}
				}
			}catch(_0xa7419){
				$.log(_0xa7419);
			}finally{
				_0x4ff4f0();
			}
		});
	});
}
async function joinShop(){
	return new Promise(async _0x41fe5b=>{
		$.errorJoinShop='活动太火爆，请稍后再试';
		let _0x533720='';
		if($.shopactivityId)_0x533720=',"activityId":'+$.shopactivityId;
		const _0x55d556='{"venderId":"1000014486","shopId":"1000014486","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0'+_0x533720+',"channel":406}';
		const _0x52b9ee={'appid':'jd_shop_member','functionId':'bindWithVender','clientVersion':'9.2.0','client':'H5','body':JSON.parse(_0x55d556)};
		const _0x1570b4=await getH5st('8adfb',_0x52b9ee);
		const _0xb8a99c={'url':'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body='+_0x55d556+'&clientVersion=9.2.0&client=H5&uuid=88888&h5st='+encodeURIComponent(_0x1570b4),'headers':{'accept':'*/*','accept-encoding':'gzip, deflate, br','accept-language':'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7','cookie':cookie,'origin':'https://shopmember.m.jd.com/','user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'}};
		$.get(_0xb8a99c,async(_0x141aa7,_0x243045,_0xde3824)=>{
			try{
				_0xde3824=_0xde3824&&_0xde3824.match(/jsonp_.*?\((.*?)\);/)&&_0xde3824.match(/jsonp_.*?\((.*?)\);/)[1]||_0xde3824;
				let _0x295791=$.toObj(_0xde3824,_0xde3824);
				if(_0x295791&&typeof _0x295791=='object'){
					if(_0x295791&&_0x295791.success===true){
						console.log(_0x295791.message);
						$.errorJoinShop=_0x295791.message;
						if(_0x295791.result&&_0x295791.result['giftInfo']){
							for(let _0x3e7c61 of _0x295791.result['giftInfo']['giftList']){
								console.log('入会获得:'+_0x3e7c61.discountString+_0x3e7c61.prizeName+_0x3e7c61.secondLineDesc);
							}
						}
					}else if(_0x295791&&typeof _0x295791=='object'&&_0x295791.message){
						$.errorJoinShop=_0x295791.message;
						console.log(''+(_0x295791.message||''));
					}else{
						console.log(_0xde3824);
					}
				}else{
					console.log(_0xde3824);
				}
			}catch(_0x45c215){
				$.logErr(_0x45c215,_0x243045);
			}finally{
				_0x41fe5b();
			}
		});
	});
}
async function getshopactivityId(){
	return new Promise(async _0xbcce3=>{
		let _0x14d4d8='{"venderId":"1000014486","channel":406,"payUpShop":true}';
		const _0x4acb87={'appid':'jd_shop_member','functionId':'getShopOpenCardInfo','clientVersion':'9.2.0','client':'H5','body':JSON.parse(_0x14d4d8)};
		const _0x3ae6b4=await getH5st('ef79a',_0x4acb87);
		const _0x5b3e64={'url':'https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body='+_0x14d4d8+'&clientVersion=9.2.0&client=H5&uuid=88888&h5st='+encodeURIComponent(_0x3ae6b4),'headers':{'accept':'*/*','accept-encoding':'gzip, deflate, br','accept-language':'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7','cookie':cookie,'origin':'https://shopmember.m.jd.com/','user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'}};
		$.get(_0x5b3e64,async(_0x5417b1,_0x43555e,_0x2294ff)=>{
			try{
				_0x2294ff=_0x2294ff&&_0x2294ff.match(/jsonp_.*?\((.*?)\);/)&&_0x2294ff.match(/jsonp_.*?\((.*?)\);/)[1]||_0x2294ff;
				let _0x4cff44=$.toObj(_0x2294ff,_0x2294ff);
				if(_0x4cff44&&typeof _0x4cff44=='object'){
					if(_0x4cff44&&_0x4cff44.success==true){
						console.log('入会:'+(_0x4cff44.result['shopMemberCardInfo']['venderCardName']||''));
						$.shopactivityId=_0x4cff44.result['interestsRuleList']&&_0x4cff44.result['interestsRuleList'][0]&&_0x4cff44.result['interestsRuleList'][0]['interestsInfo']&&_0x4cff44.result['interestsRuleList'][0]['interestsInfo']['activityId']||'';
					}
				}else{
					console.log(_0x2294ff);
				}
			}catch(_0x2d80db){
				$.logErr(_0x2d80db,_0x43555e);
			}finally{
				_0xbcce3();
			}
		});
	});
}
function getH5st(_0xcd0876,_0x4cfb47){
	return new Promise(async _0x4b70cd=>{
		let _0x39a600={'url':'http://api.kingran.cf/h5st','body':'businessId='+_0xcd0876+'&req='+encodeURIComponent(JSON.stringify(_0x4cfb47)),'headers':{'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88'},'timeout':30*1000};
		$.post(_0x39a600,(_0x340dbf,_0x22650d,_0x34fb00)=>{
			try{
				if(_0x340dbf){
					console.log(JSON.stringify(_0x340dbf));
					console.log($.name+' getSign API请求失败，请检查网路重试');
				}else{}
			}catch(_0x41cb98){
				$.logErr(_0x41cb98,_0x22650d);
			}finally{
				_0x4b70cd(_0x34fb00);
			}
		});
	});
}
function taskUrl(_0x31d790,_0x19b957){
	return{'url':''+$.activityUrls+_0x31d790,'headers':{'Host':'lzkjdz-isv.isvjcloud.com','Accept':'application/json','X-Requested-With':'XMLHttpRequest','Accept-Language':'zh-cn','Accept-Encoding':'gzip, deflate, br','Content-Type':'application/x-www-form-urlencoded','Origin':'https://lzkjdz-isv.isvjcloud.comm','User-Agent':'jdapp;iPhone;9.5.4;13.6;'+$.UUID+';network/wifi;ADID/'+$.ADID+';model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1','Connection':'keep-alive','Referer':$.activityUrl,'Cookie':cookie+activityCookie+';IsvToken='+$.Token+';AUTH_C_USER='+$.AUTH_C_USER},'body':_0x19b957};
}
function getMyPing(){
	let _0x37b51c={'url':'https://lzkjdz-isv.isvjcloud.com/customer/getMyPing','headers':{'Host':'lzkjdz-isv.isvjcloud.com','Accept':'application/json','X-Requested-With':'XMLHttpRequest','Accept-Language':'zh-cn','Accept-Encoding':'gzip, deflate, br','Content-Type':'application/x-www-form-urlencoded','Origin':'https://lzkjdz-isv.isvjcloud.com','User-Agent':'jdapp;iPhone;9.5.4;13.6;'+$.UUID+';network/wifi;ADID/'+$.ADID+';model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1','Connection':'keep-alive','Referer':$.activityUrl,'Cookie':cookie},'body':'userId='+$.activityShopId+'&token='+$.token+'&fromType=APP&riskType=1'};
	return new Promise(_0x5ed210=>{
		$.post(_0x37b51c,(_0x3d9240,_0x327601,_0x227940)=>{
			try{
				if(_0x3d9240){
					$.log(_0x3d9240);
				}else{
					setActivityCookie(_0x327601);
					if(_0x227940){
						_0x227940=JSON.parse(_0x227940);
						if(_0x227940.result){
							$.log('用户名：'+_0x227940.data['nickname']);
							$.pin=_0x227940.data['nickname'];
							$.secretPin=_0x227940.data['secretPin'];
							cookie=cookie+';AUTH_C_USER='+_0x227940.data['secretPin'];
						}else{
							$.log(_0x227940.errorMessage);
						}
					}else{
						$.log('京东返回了空数据');
					}
				}
			}catch(_0x10e3aa){
				$.log(_0x10e3aa);
			}finally{
				_0x5ed210();
			}
		});
	});
}
function getFirstLZCK(){
	return new Promise(_0x24b6f1=>{
		$.get({'url':$.activityUrl,'headers':{'user-agent':$.isNode()?process.env['JD_USER_AGENT']?process.env['JD_USER_AGENT']:require('./USER_AGENTS')['USER_AGENT']:$.getdata('JDUA')?$.getdata('JDUA'):'jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'}},(_0x24aa79,_0x3f7bc0,_0x3a874e)=>{
			try{
				if(_0x24aa79){
					console.log(_0x24aa79);
				}else{
					setActivityCookie(_0x3f7bc0);
				}
			}catch(_0x105a89){
				console.log(_0x105a89);
			}finally{
				_0x24b6f1();
			}
		});
	});
}
function random(_0x497b0c,_0x4daa4b){
	return Math.floor(Math.random()*(_0x4daa4b-_0x497b0c))+_0x497b0c;
}
function getUUID(_0x44b665='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',_0x3e9cbe=0){
	return _0x44b665.replace(/[xy]/g,function(_0xb0834a){
		var _0x2e378b=Math.random()*0x10|0x0,_0x2643a0=_0xb0834a=='x'?_0x2e378b:_0x2e378b&0x3|0x8;
		if(_0x3e9cbe){
			uuid=_0x2643a0.toString(36)['toUpperCase']();
		}else{
			uuid=_0x2643a0.toString(36);
		}
		return uuid;
	});
}
function checkCookie(){
	const _0x16fd9b={'url':'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion','headers':{'Host':'me-api.jd.com','Accept':'*/*','Connection':'keep-alive','Cookie':cookie,'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1','Accept-Language':'zh-cn','Referer':'https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&','Accept-Encoding':'gzip, deflate, br'}};
	return new Promise(_0x2da881=>{
		$.get(_0x16fd9b,(_0x3bb257,_0x4eb0e4,_0x79ba2d)=>{
			try{
				if(_0x3bb257){
					$.logErr(_0x3bb257);
				}else{
					if(_0x79ba2d){
						_0x79ba2d=JSON.parse(_0x79ba2d);
						if(_0x79ba2d.retcode==='1001'){
							$.isLogin=false;
							return;
						}
						if(_0x79ba2d.retcode==='0'&&_0x79ba2d.data['hasOwnProperty']('userInfo')){
							$.nickName=_0x79ba2d.data['userInfo']['baseInfo']['nickname'];
						}
					}else{
						$.log('京东返回了空数据');
					}
				}
			}catch(_0x436985){
				$.logErr(_0x436985);
			}finally{
				_0x2da881();
			}
		});
	});
}
function setActivityCookie(_0x520b4c){
	if(_0x520b4c){
		if(_0x520b4c.headers['set-cookie']){
			cookie=originCookie+';';
			for(let _0x38a1da of _0x520b4c.headers['set-cookie']){
				lz_cookie[_0x38a1da.split(';')[0]['substr'](0,_0x38a1da.split(';')[0]['indexOf']('='))]=_0x38a1da.split(';')[0]['substr'](_0x38a1da.split(';')[0]['indexOf']('=')+1);
			}
			for(const _0x2f5fd7 of Object.keys(lz_cookie)){
				cookie+=_0x2f5fd7+'='+lz_cookie[_0x2f5fd7]+';';
			}
			activityCookie=cookie;
		}
	}
}
function getAuthorCodeList(_0x5b7463){
	return new Promise(_0x35c2a5=>{
		const _0x14c57d={'url':_0x5b7463+'?'+new Date(),'timeout':10000,'headers':{'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88'}};
		$.get(_0x14c57d,async(_0x450941,_0x135b66,_0x22a357)=>{
			try{
				if(_0x450941){
					$.getAuthorCodeListerr=false;
				}else{
					if(_0x22a357)_0x22a357=JSON.parse(_0x22a357);
					$.getAuthorCodeListerr=true;
				}
			}catch(_0x419295){
				$.logErr(_0x419295,_0x135b66);
				_0x22a357=null;
			}finally{
				_0x35c2a5(_0x22a357);
			}
		});
	});
}
async function getUA(){
	$.UA='jdapp;iPhone;10.1.4;13.1.2;'+randomString(40)+';network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1';
}
function randomString(_0x1d8254){
	_0x1d8254=_0x1d8254||32;
	let _0x2fbed1='abcdef0123456789',_0x3166a8=_0x2fbed1.length,_0x5987c3='';
	for(i=0;i<_0x1d8254;i++)_0x5987c3+=_0x2fbed1.charAt(Math.floor(Math.random()*_0x3166a8));
	return _0x5987c3;
};
// prettier-ignore
!function (n) { "use strict"; function t(n, t) { var r = (65535 & n) + (65535 & t); return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function r(n, t) { return n << t | n >>> 32 - t } function e(n, e, o, u, c, f) { return t(r(t(t(e, n), t(u, f)), c), o) } function o(n, t, r, o, u, c, f) { return e(t & r | ~t & o, n, t, u, c, f) } function u(n, t, r, o, u, c, f) { return e(t & o | r & ~o, n, t, u, c, f) } function c(n, t, r, o, u, c, f) { return e(t ^ r ^ o, n, t, u, c, f) } function f(n, t, r, o, u, c, f) { return e(r ^ (t | ~o), n, t, u, c, f) } function i(n, r) { n[r >> 5] |= 128 << r % 32, n[14 + (r + 64 >>> 9 << 4)] = r; var e, i, a, d, h, l = 1732584193, g = -271733879, v = -1732584194, m = 271733878; for (e = 0; e < n.length; e += 16)i = l, a = g, d = v, h = m, g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, d), m = t(m, h); return [l, g, v, m] } function a(n) { var t, r = "", e = 32 * n.length; for (t = 0; t < e; t += 8)r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255); return r } function d(n) { var t, r = []; for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1)r[t] = 0; var e = 8 * n.length; for (t = 0; t < e; t += 8)r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32; return r } function h(n) { return a(i(d(n), 8 * n.length)) } function l(n, t) { var r, e, o = d(n), u = [], c = []; for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1)u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r]; return e = i(u.concat(d(t)), 512 + 8 * t.length), a(i(c.concat(e), 640)) } function g(n) { var t, r, e = ""; for (r = 0; r < n.length; r += 1)t = n.charCodeAt(r), e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t); return e } function v(n) { return unescape(encodeURIComponent(n)) } function m(n) { return h(v(n)) } function p(n) { return g(m(n)) } function s(n, t) { return l(v(n), v(t)) } function C(n, t) { return g(s(n, t)) } function A(n, t, r) { return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n) } $.md5 = A }(this);
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
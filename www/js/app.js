var appKey    = "ed5e5b4ee0b53cf1438bdaf6f7e05c0a504939cfe356095614f2562565a94b60";
var clientKey = "a6e6046e429453f0bd6f8ecd0b1d686f1b25425a5582a8217ec6d5c540fec49f";
var ncmb = new NCMB(appKey, clientKey);

///// Called when app launch
ons.ready(function(){
$(function() {
  $("#LoginBtn").click(onLoginBtn);
  $("#RegisterBtn").click(onRegisterBtn);
  $("#posting").click(onPosting);
  $("#c_posting").click(onC_posting);
  $("#evaluationBtn").click(onEvaluation);
  //$("#reration").click(onReration);
  //$("#c_novelList").html(onC_novelList);
  $("#YesBtn_logout").click(onLogoutBtn);
  $("#password_change").click(onPasswordChange);
  $("#go_search").click(onSearch);
  $("#no_search").click(onNosearch);
  $("#newLine").click(onNewline);
  $("#c_newLine").click(onC_newline);
         });
});

//----------------------------------USER MANAGEMENT-------------------------------------//
var currentLoginUser; //現在ログイン中ユーザー

//登録ボタン
function onRegisterBtn()
{
    //入力フォームからusername, password変数にセット
    var username = $("#reg_username").val();
    var handlename = $("#reg_handlename").val();
    var password = $("#reg_password").val();
    var mail = $("#reg_mail").val();
    
    var user = new ncmb.User();
    user.set("userName", username)
        .set("handlename", handlename)
        .set("password", password)
        .set("mailAddress", mail);
    
    // 任意フィールドに値を追加 
    user.signUpByAccount()
        .then(function(user) {
            alert("登録しました");
            currentLoginUser = ncmb.User.getCurrentUser();
            location.href="index.html";
        })
        .catch(function(error) {
            alert("新規登録に失敗！次のエラー発生：" + error);
        });
}

//ログインボタン
function onLoginBtn()
{
    var username = $("#login_username").val();
    var password = $("#login_password").val();
    // ユーザー名とパスワードでログイン
    ncmb.User.login(username, password)
        .then(function(user) {
            currentLoginUser = ncmb.User.getCurrentUser();
            location.href="home.html";
        })
        .catch(function(error) {
            alert("ログイン失敗！次のエラー発生: " + error);
        });
}

//ログアウト
function onLogoutBtn()
{
    myRet = confirm("ログアウトしますがよろしいですか？");
    if(myRet==true){
    ncmb.User.logout();
    alert('ログアウトしました');
    currentLoginUser = null;
    location.href="index.html";
    }
}

//パスワード変更
function onPasswordChange()
{
    myRet = confirm("パスワードを変更しますか？\n登録されているアドレスにメールが送信されます");
    if(myRet==true){
var user = new ncmb.User();
var mail = ncmb.User.getCurrentUser().mailAddress;
user.set("mailAddress", mail);
user.requestPasswordReset()
    .then(function(data){
        alert('メールを送信しました。');
    })
    .catch(function(err){
      // エラー処理
    });
    }
}

//入力・チェックが入ると登録可能
$(function() {
    //ボタン無効
    $('#RegisterBtn').attr('disabled', 'disabled');
    //投稿関連
    $('#posting').attr('disabled', 'disabled');
    $('#c_posting').attr('disabled', 'disabled');
    
    //親作品投稿ボタン
        $('#title,#novel').bind('keydown keyup keypress change', function() {
        if ($('#title').val().length > 0 && $('#novel').val().length > 0) {
            $('#posting').removeAttr('disabled');
    	} else {
    	  $('#posting').attr('disabled', 'disabled'); 
		}
	});
         
    //ID,PASS,メール入力
	$('#reg_username,#reg_handlename,#reg_password,#reg_mail').bind('keydown keyup keypress change', function() {
		if ($('#reg_username').val().length > 0 && $('#reg_handlename').val().length > 0 && $('#reg_password').val().length > 0 && $('#reg_mail').val().length > 0) {
			$('#RegisterBtn').removeAttr('disabled');
		} else {
    	  $('#RegisterBtn').attr('disabled', 'disabled');  
		}
	});    
    
    //子作品投稿ボタン
    $('#c_title,#c_novel').bind('keydown keyup keypress change', function() {
        if ($('#c_title').val().length > 0 && $('#c_novel').val().length > 0) {
            $('#c_posting').removeAttr('disabled');
        } else {
          $('#c_posting').attr('disabled', 'disabled'); 
    	}
    });
    
});
//----------------------------------DATA STORE-------------------------------------//
//親作品投稿
function onPosting()
{
var Taichel = ncmb.DataStore("Taichel");
var taichel = new Taichel();

var novel = $("#novel").val();
var contributor = ncmb.User.getCurrentUser().handlename;
var noveltitle = $("#title").val();

taichel.set("novel", novel)
         .set("Contributor", contributor)
         .set("noveltitle", noveltitle)
         .save()
         .then(function(novels){
          alert("投稿しました。");
          $('textarea').val("");
          $('input[type="text"]').val(""); 
          location.href="home.html";
         })
         .catch(function(err){
          alert("失敗しました" + error);
         });
};

//親作品タイトル表示
$(function(){
var Taichel = ncmb.DataStore("Taichel");
Taichel.order("createDate",true)
       .limit(3)
       .fetchAll()
       .then(function(results){
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var title = object.noveltitle;
              var cont = object.Contributor;
              var novel = object.novel;
              var id = object.objectId;
              document.getElementById("novelList").innerHTML+="<a href='novels.html?"+novel+'&'+title+'&'+id+"'>"+title+"</a>"+"<br>";
            }
          })
         .catch(function(err){
            console.log("読み込めませんでした\n"+err);
          });
});

function onSearch(){
            var Taichel = ncmb.DataStore("Taichel");
            var searchword = $("#search_form").val();
            document.getElementById("novelList").innerHTML="";
        Taichel.regularExpressionTo("noveltitle",searchword)
            　 .order("createDate",true)
               .fetchAll()
               .then(function(results){
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var title = object.noveltitle;
              var cont = object.Contributor;
              var novel = object.novel;
              var id = object.objectId;
              document.getElementById("novelList").innerHTML+="<a href='novels.html?"+novel+'&'+title+'&'+id+"'>"+title+"</a>"+"<br>";
            }
          })
         .catch(function(err){
            console.log("読み込めませんでした\n"+err);
          });
          };

function onNosearch(){
            document.getElementById("novelList").innerHTML="";
            var Taichel = ncmb.DataStore("Taichel");
            $('input[type="text"]').val(""); 
            Taichel.order("createDate",true)
                   .limit(3)
                   .fetchAll()
                   .then(function(results){
                for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var title = object.noveltitle;
                var cont = object.Contributor;
                var novel = object.novel;
                var id = object.objectId;
              //$("#novelList").html(object.get("noveltitle"));
              document.getElementById("novelList").innerHTML+="<a href='novels.html?"+novel+'&'+title+'&'+id+"'>"+title+"</a>"+"<br>";
            }
          })
         .catch(function(err){
            console.log("読み込めませんでした\n"+err);
          });
};



//親作品内容表示
function init() {
        var Taichel = ncmb.DataStore("Taichel");
        var taichel = new Taichel();
    
        var url = location.search.split("?")[1];  // 行Ａ
        var para = url.split("&");                // 行Ｂ
        var n = para.length;
        for (var i=0; i<n; i++) {
            para[i] = decodeURIComponent(para[i]);         // 行Ｃ
        }
        
        var novel = para[0];
        var title = para[1];
        var id = para[2];
        
        document.getElementById('novelcontent').innerHTML = novel;
        document.getElementById('noveltitle').innerHTML = title;
        
        function onC_link(){
            location.href="c_novelList.html?"+id+"";
        };
        $("#c_link").click(onC_link);
        
        //以下評価関連
        var Evaluation = ncmb.DataStore("Evaluation");
    
    var user = ncmb.User.getCurrentUser().userName;
    
    //評価表示
    Evaluation.equalTo("novelId", id)
              .count()
              .fetchAll()
              .then(function(results){
                var eval_count = results.count;
                document.getElementById('evaluation').innerHTML = eval_count;
              })
              .catch(function(err){
                console.log("読み込めませんでした\n"+err);
              });
    //ボタン無効   
    Evaluation.equalTo("novelId", id)
              .equalTo("userName", user)
              .count()
              .fetchAll()
              .then(function(results){
                var counter = results.count;
                if(counter < 1) {
                $('#evaluationBtn').removeAttr('disabled');
            } else {
            $('#evaluationBtn').attr('disabled', 'disabled'); 
            }
              });
};

//親作品評価
function onEvaluation(){
    var Taichel = ncmb.DataStore("Taichel");
    var taichel = new Taichel();
    
    var Evaluation = ncmb.DataStore("Evaluation");
    var evaluation = new Evaluation();
    
    var url = location.search.split("?")[1];  // 行Ａ
        var para = url.split("&");                // 行Ｂ
        var n = para.length;
        for (var i=0; i<n; i++) {
            para[i] = decodeURIComponent(para[i]);         // 行Ｃ
        }

        var id = para[2];
        
    var user = ncmb.User.getCurrentUser().userName;
    
    evaluation.set("novelId", id)
         .set("userName", user)
         .save()
         .then(function(){
          alert("評価しました。");
         })
         .catch(function(err){
          alert("失敗しました" + error);
         });
         
         var counter;
         
       $('#evaluationBtn').attr('disabled', 'disabled'); 
       
       var eval_count;
       
       //評価反映
       Evaluation.equalTo("novelId", id)
              .count()
              .fetchAll()
              .then(function(results){
                eval_count = results.count; 
                document.getElementById('evaluation').innerHTML = eval_count+1;
              })
              .catch(function(err){
                console.log("読み込めませんでした\n"+err);
              });
    
    　　//作品評価数更新
       Taichel.equalTo("objectId", id)
       .fetchAll()
       .then(function(results){
           for (var i = 0; i < results.length; i++) {
              var object = results[i];
              object.set("evaluation", eval_count+1);
           return object.update();
           };
       });
};
    
//子作品タイトル表示   
function init2() {
var id = decodeURIComponent(location.search.split("?")[1]);

var Taichel_jr = ncmb.DataStore("Taichel_jr");

Taichel_jr.equalTo("parentId", id)
              .order("createDate",true)
              .fetchAll()
              .then(function(results){
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                  var title = object.noveltitle;
                  var cont = object.Contributor;
                  var novel = object.novel;
                  var id = object.objectId;
                  document.getElementById("c_novelList").innerHTML+="<a href='c_novels.html?"+novel+'&'+title+'&'+id+"'>"+title+"</a>"+"<br>";
                }
              })
              .catch(function(err){
                console.log("読み込めませんでした\n"+err);
              });
              function onC_pos(){
            location.href="c_posting.html?"+id+"";
        };
        $("#c_pos").click(onC_pos);
        
        
            var zexal = location.search.split("?")[1];
        //     var b_para = b_url.split("#");
        //     var b_n = b_para.length;
        //     for (var i=0; i<b_n; i++) {
        //     b_para[i] = decodeURIComponent(b_para[i]);         // 行Ｃ
        // }
        
        if(zexal == "cxyzc"){
          Taichel_jr.equalTo("parentId", id)
              .order("createDate",true)
              .fetchAll()
              .then(function(results){
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                  var title = object.noveltitle;
                  var cont = object.Contributor;
                  var novel = object.novel;
                  var id = object.objectId;
                  document.getElementById("c_novelList").innerHTML+="<li><a href='c_novels.html?"+novel+'&'+title+'&'+id+"'>"+title+"</a></li>"+"<br>";
                }
              })
              .catch(function(err){
                console.log("読み込めませんでした\n"+err);
              });
                
              function onC_pos(){
            location.href="c_posting.html?"+id+"";
        };
        $("#c_pos").click(onC_pos);
        }
};

//子作品内容表示
function init3() {
        var url = location.search.split("?")[1];  // 行Ａ
        var para = url.split("&");                // 行Ｂ
        var n = para.length;
        for (var i=0; i<n; i++) {
            para[i] = decodeURIComponent(para[i]);         // 行Ｃ
        }
        
        var novel = para[0];
        var title = para[1];
        var id = para[2];
        
        document.getElementById('c_novelcontent').innerHTML = novel;
        document.getElementById('c_noveltitle').innerHTML = title;
        
        function onC_link(){
            location.href="c_novelList.html?"+id+"";
        };
        $("#c_link").click(onC_link);
        
        function onBack(){
        var zexal = "cxyzc";
            location.href="c_novelList.html?"+id+'#'+zexal+"";
        };
        $("#back").click(onBack);
    };

//子作品投稿
function onC_posting()
{
var id = decodeURIComponent(location.search.split("?")[1]);
    
var Taichel_jr = ncmb.DataStore("Taichel_jr");
var c_novels = new Taichel_jr();

var c_novel = $("#c_novel").val();
var c_contributor = ncmb.User.getCurrentUser().handlename;
var c_noveltitle = $("#c_title").val();

c_novels.set("novel", c_novel)
         .set("Contributor", c_contributor)
         .set("noveltitle", c_noveltitle)
         .set("parentId", id)
         .save()
         .then(function(){
          alert("投稿しました。");
          // $('textarea').val("");
          // $('input[type="text"]').val(""); 
          location.href="c_novelList.html?"+id+"";
         })
         .catch(function(err){
          alert("失敗しました" + error);
         });
         
};

//親作品改行
function onNewline() {
//挿入する文字列
var strInsert = "<br>";

//現在のテキストエリアの文字列
var strOriginal = document.getElementById('novel').value;

//現在のカーソル位置
var posCursole = document.getElementById('novel').selectionStart;
//カーソル位置より左の文字列
var leftPart = strOriginal.substr(0, posCursole);
//カーソル位置より右の文字列
var rightPart = strOriginal.substr(posCursole, strOriginal.length);

//文字列を結合して、テキストエリアに出力
document.getElementById('novel').value = leftPart + strInsert + rightPart;
}

//子作品改行
function onC_newline() {
//挿入する文字列
var strInsert = "<br>";

//現在のテキストエリアの文字列
var strOriginal = document.getElementById('c_novel').value;

//現在のカーソル位置
var posCursole = document.getElementById('c_novel').selectionStart;
//カーソル位置より左の文字列
var leftPart = strOriginal.substr(0, posCursole);
//カーソル位置より右の文字列
var rightPart = strOriginal.substr(posCursole, strOriginal.length);

//文字列を結合して、テキストエリアに出力
document.getElementById('c_novel').value = leftPart + strInsert + rightPart;
}

//評価
// function onEvaluation(){
//     var Taichel = ncmb.DataStore("Taichel");
//     var taichel = new Taichel();
//     
//     var Evaluation = ncmb.DataStore("Evaluation");
//     var evaluation = new Evaluation();
//     
//     var url = location.search.split("?")[1];  // 行Ａ
//         var para = url.split("&");                // 行Ｂ
//         var n = para.length;
//         for (var i=0; i<n; i++) {
//             para[i] = decodeURIComponent(para[i]);         // 行Ｃ
//         }
//         
//         var novel = para[0];
//         var title = para[1];
//         var id = para[2];
//         
//     var user = ncmb.User.getCurrentUser().userName;
//     
//     evaluation.set("novelId", id)
//          .set("userName", user)
//          .save()
//          .then(function(){
//           alert("評価しました。");
//          })
//          .catch(function(err){
//           alert("失敗しました" + error);
//          });
//          
//          Taichel.equalTo("objectId", id)
//            .fetchAll()
//            .then(function(results){
//             taichel.set("evaluation", eval_count);
//             taichel.save();
//            return taichel.update();
//        });
//          
// }

//現在不要
//function onReration(){
//var Taichel_jr = ncmb.DataStore("Taichel_jr");
//var Taichel_jr1 = new Taichel_jr({name: "orange", type: "fruit"});
//var Taichel_jr2 = new Taichel_jr({name: "apple", type: "fruit"});
//
// リレーションを作成してオブジェクトを追加
//var relation = new ncmb.Relation();
//relation.add(Taichel_jr1).add(Taichel_jr1);
//
//var Taichel = ncmb.DataStore("Taichel");
//var taichel = new Taichel();
//
//// リレーションをプロパティに追加
//Taichel.equalTo("objectId", "a64kjj3DOUN4i7th")
//       .fetchAll()
//       .then(function(results){
//           for (var i = 0; i < results.length; i++) {
//              var object = results[i];
//              object.set("Relation", relation);
//              //object.save();
//           return object.update();
//           };
//       });
//
//};
        

// 保存（リレーションに追加されたオブジェクトも同時に保存されます）
//入れるならinit2()
         //リレーション化
//          var relation = new ncmb.Relation();
//              relation.add(c_novels);
//             
//             var Taichel = ncmb.DataStore("Taichel");
//             var taichel = new Taichel();
// 
// // リレーションをプロパティに追加
// Taichel.equalTo("objectId", para)
       // .fetchAll()
       // .then(function(results){
       //     for (var i = 0; i < results.length; i++) {
       //        var object = results[i];
       //        object.set("Relation", relation);
       //        //object.save();
       //     return object.update();
       //     };
       // });







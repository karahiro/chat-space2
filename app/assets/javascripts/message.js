$(document).on("turbolinks:load", function() {

    $(function(){
    setInterval(update, 5000);
    //5000ミリ秒ごとにupdateという関数を実行する
  });

  function flash() {
    var html =`<p class="notice">メッセージを送信しました</p>`
    $('.notification').append(html);
    $('.notice').fadeIn(500).fadeOut(2000); //指定したクラスを0.5秒でfade inさせて、2秒でfade outさせる。
    setTimeout(function(){
     $('.notice').remove();
    },2500); //指定のクラス自体をremoveする。
  }

  function buildHTML(message){
    var insertImage = '';
    if (message.image) {
      insertImage = `<img src="${message.image}">`;
    }
    var html = `<div class="chat-main__body--id" data-message-id="${message.id}">
                <div class="chat-main__body--name">
                  ${message.user_name}
                </div>
                <div class="chat-main__body--date">
                  ${message.created_at}
                </div>
                <div class="chat-main__body--message">
                <p class="lower-message__content">
                  ${message.content}
                </p>
                <img class='lower-message__image'>
                  ${insertImage}
                </img>
                </div>
                </div>`
    return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__body').append(html)
      $('#textbox').val('')
      flash();
      var position = $('#chat-main__body').offset().top;
      $('.chat-main__body').animate({scrollTop: position + "99px"}, 500);
    })
    .fail(function(data){
      alert('メッセージを入力してください');
    });
    return false;
  });


  function update(){ //この関数では以下のことを行う
     if($('.chat-main__body--id')[0]){ //もし'messages'というクラスがあったら
      var message_id = $('.chat-main__body--id:last').data('messageId'); //一番最後にある'messages'というクラスの'id'というデータ属性を取得し、'message_id'という変数に代入
    } else { //ない場合は
      var message_id = 0 //0を代入
    }

    var message_id = $('.chat-main__body--id:last').data('messageId'); //一番最後にある'messages'というクラスの'id'というデータ属性を取得し、'message_id'という変数に代入
   $.ajax({ //ajax通信で以下のことを行う
      url: location.href, //urlは現在のページを指定
      type: 'GET', //メソッドを指定
      data: { //railsに引き渡すデータは
        message: { id: message_id } //このような形(paramsの形をしています)で、'id'には'message_id'を入れる
      },
      dataType: 'json' //データはjson形式
    })
    .done(function(data){
      $.each(data, function(i, data){ //'data'を'data'に代入してeachで回す
        var html = buildHTML(data);
        $('.chat-main__body').append(html)
        var position = $('#chat-main__body').offset().top;
        $('.chat-main__body').animate({scrollTop: position + "99px"}, 500);
      });
    });
  }
});

// .done(function(data){
//  +      if (data.length == 0) return false
//  +      data.forEach(function(msg) {
//  +        var html = buildHTML(msg)
//  +        $('.chat-main__body--messages-list').append(html)
//  +      })


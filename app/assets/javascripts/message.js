$(document).on("turbolinks:load", function() {

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
    var html = `<div class="chat-main__body--name">
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

// メッセージ自動更新
    var interval = setInterval(function() {
      if (window.location.href.match(/\/groups\/\d+\/messages/)) {
    $.ajax({
      type: 'GET',
      url: location.href,
      dataType: 'json'
    })
    .done(function(data) {
      var id = $('.chat-main__body').find('.chat-main__body--id');
      var insertHTML = '';
      data.messages.forEach(function(message) {
        if (message.id > id ) {
          insertHTML += buildHTML(message);
        }
      });
      $('.chat-main__body').prepend(insertHTML);
      console.log("自動更新に成功しました");
    })
    .fail(function(data) {
      alert('自動更新に失敗しました');
    });
  } else {
    clearInterval(interval);
   }} , 5 * 1000 );
});



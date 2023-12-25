document.getElementById('send-btn-dest').addEventListener('click', function() {
    //window.location.href = 'main.html';
    const src = document.getElementById("setup-textarea-src").value;
    const dest = document.getElementById("setup-textarea-dest").value;
    localStorage.setItem('usersrc', src);
    localStorage.setItem('userdest', dest);
    window.location.href = 'main.html';
});
const socket = io('http://localhost:3000');
const btnSend = document.querySelector('#btn-send')
const displayUsers1 = document.querySelector('.users')
const displaylistuser = document.querySelector('.listuser')
let Users = []
var name=""
const login = () => {
    name = $('#yourname').val();
    socket.emit('adduser',name)
    $('#before_login').hide();
    $('#after_login').show();
    document.querySelector('#your-name').textContent = name
}

const display = (msg,type)=>{
    const msgDiv = document.createElement('div')
    let className = type
    msgDiv.classList.add(className,'message-row')
    let times =new Date().toLocaleTimeString()

    let innerText= `
    <div class="message-title">
        ✉<span>${msg.userEmit}</span>
    </div>
    <div class="message-text">
        ${msg.message}
    </div>
    <div class="message-time">
        ${times}
    </div>
    `;
    msgDiv.innerHTML = innerText;
    if (type==="your-message") {
        const displayMsg = document.querySelector('#message-'+msg.userRec)
        displayMsg.appendChild(msgDiv)
        const chatBox = document.querySelector('.chat-content')
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        const displayMsg = document.querySelector('#message-'+msg.userEmit)
        displayMsg.appendChild(msgDiv)
        const chatBox = document.querySelector('.chat-content')
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
}

const sendMsg = (message,dst) =>{
    let msg = {
        userEmit: name,
        userRec: dst,
        message: message.trim()
    }

    display(msg, 'your-message')

    socket.emit('sendMessage',msg)
}

const addEventListener2 = (msg)=>{
    document.querySelector('#btn-send-'+msg).addEventListener('click',(e)=>{
        e.preventDefault()
        const msgText = document.querySelector('#msg-'+msg)
        sendMsg(msgText.value,msg)
        msgText.value = ' ';
        msgText.focus();    
    })
}

socket.on("listUsers",msg=>{
    msg.forEach(element => {
        displayUsers(element)
        addEventListener2(element)
    });
})


socket.on('newuser' , msg=>{
    displayUsers(msg)
    addEventListener2(msg)
})

socket.on("utilisateurdeconnecte",user=>{
    var element = document.getElementById("chat-"+user);
    element. parentNode.removeChild(element);
    var element2 = document.getElementById("name-"+user);
    element2.parentNode.removeChild(element2);
})

const displayUsers = (user)=>{
    const msgDiv = document.createElement('div')
    msgDiv.classList.add("users1",'users')
    let innerText= `
    <div  id="chat-${user}">
        <div class="chat-container">
           
        <div class="chat-header">
    
            <div id="t1">
    		<p><img src="logo.png" alt="logo">
    			<h1 >Chat-Together</h1></p>
    		</div>
            <h3 id="other-name">Msg to : ${user}</h3>
        </div>

        <div class="chat-section" >
            <div class="main-wrapper">
                <div class="chat-content">
                    <div class="message" id="message-${user}">
                        <div class="message-row other-message">
                           

                        </div>
                        <div class="message-row your-message">
                            
                        </div>
                    </div>

                </div>
                <!------------------------------------>
                <!--form class ="msg-text"-->
                <div  class ="msg-text">
                    <input type="text" name ="msg" id="msg-${user}"
                    placeholder="Write here......" autocomplete="off">
                    <button id ="btn-send-${user}">
                        <i class="fas fa-paper-plane">Send</i>
                    </button>
                <div>
                <!--/form-->
            </div>            
        </div>
    </div>
    </div>
    </div>
<br>
</div>

    `;
    msgDiv.innerHTML = innerText;
    displayUsers1.appendChild(msgDiv)
    
    const msgDiv2 = document.createElement('div')
    msgDiv2.classList.add("listuser1",'listuser')
    let innerText2= `
    <div class="tr">
        <p id="name-${user}">@${user}</p>
    </div>
    `;
    msgDiv2.innerHTML = innerText2;
    displaylistuser.appendChild(msgDiv2)
}


socket.on('sendToAll',msg=>{
    display(msg, 'other-message')
})



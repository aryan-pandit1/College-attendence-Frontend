/* ===========================
   PAGE
=========================== */

.forgot-page{
    min-height:100vh;
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    background:linear-gradient(135deg,#4f46e5,#2563eb,#0f172a);
    padding:20px;
}

/* ===========================
   CARD
=========================== */

.forgot-card{
    width:100%;
    max-width:430px;
    background:rgba(255,255,255,0.12);
    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);
    border:1px solid rgba(255,255,255,0.2);
    border-radius:22px;
    padding:40px;
    box-shadow:
        0 10px 35px rgba(0,0,0,.35);
    animation:fadeUp .45s ease;
}

.forgot-card h2{
    color:#fff;
    text-align:center;
    font-size:30px;
    margin-bottom:10px;
    font-weight:700;
}

.forgot-card p{
    color:#d7d7d7;
    text-align:center;
    margin-bottom:28px;
    font-size:15px;
    line-height:1.5;
}

/* ===========================
   INPUTS
=========================== */

.forgot-card input{
    width:100%;
    padding:15px 18px;
    margin-bottom:18px;
    border:none;
    outline:none;
    border-radius:12px;
    background:rgba(255,255,255,.15);
    color:white;
    font-size:15px;
    transition:.3s;
    box-sizing:border-box;
}

.forgot-card input::placeholder{
    color:#d6d6d6;
}

.forgot-card input:focus{
    background:rgba(255,255,255,.22);
    box-shadow:0 0 0 2px rgba(255,255,255,.18);
}

/* ===========================
   BUTTON
=========================== */

.forgot-card button{
    width:100%;
    padding:15px;
    border:none;
    border-radius:12px;
    cursor:pointer;
    font-size:16px;
    font-weight:600;
    background:white;
    color:#2563eb;
    transition:.3s;
    margin-top:5px;
}

.forgot-card button:hover{
    transform:translateY(-2px);
    background:#2563eb;
    color:white;
}

.forgot-card button:disabled{
    cursor:not-allowed;
    opacity:.65;
}

/* ===========================
   BACK TO LOGIN
=========================== */

.back-login{
    margin-top:20px;
    text-align:center;
}

.back-login span{
    color:#dcdcdc;
    cursor:pointer;
    transition:.3s;
    font-size:15px;
}

.back-login span:hover{
    color:white;
    text-decoration:underline;
}

/* ===========================
   OTP SUCCESS
=========================== */

.success-text{
    color:#98fb98;
    text-align:center;
    margin-bottom:18px;
    font-weight:600;
}

/* ===========================
   ERROR
=========================== */

.error-text{
    color:#ff9f9f;
    text-align:center;
    margin-bottom:18px;
    font-size:14px;
}

/* ===========================
   STEP INDICATOR
=========================== */

.step-indicator{
    display:flex;
    justify-content:center;
    gap:10px;
    margin-bottom:30px;
}

.step{
    width:13px;
    height:13px;
    border-radius:50%;
    background:rgba(255,255,255,.3);
    transition:.3s;
}

.step.active{
    background:white;
    transform:scale(1.2);
}

/* ===========================
   LOADER
=========================== */

.loader{
    width:20px;
    height:20px;
    border:3px solid rgba(255,255,255,.3);
    border-top:3px solid white;
    border-radius:50%;
    animation:spin 1s linear infinite;
    margin:auto;
}

/* ===========================
   ANIMATIONS
=========================== */

@keyframes spin{
    to{
        transform:rotate(360deg);
    }
}

@keyframes fadeUp{

    from{
        opacity:0;
        transform:translateY(25px);
    }

    to{
        opacity:1;
        transform:translateY(0);
    }

}

/* ===========================
   MOBILE
=========================== */

@media(max-width:600px){

    .forgot-card{

        padding:30px 22px;

    }

    .forgot-card h2{

        font-size:25px;

    }

    .forgot-card input{

        font-size:14px;

    }

    .forgot-card button{

        font-size:15px;

    }

}
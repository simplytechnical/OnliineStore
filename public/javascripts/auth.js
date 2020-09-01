const showRegister = document.querySelector('.showRegister');
const showLogin = document.querySelector('.showLogin');
const panelC = document.querySelector('.panelC');
const authBody = document.getElementById('authBody');
const pageTitleC = document.querySelector('.pageTitleC');
const lastEndPage = document.querySelector('.lastEndPage');
const loginWithC = document.querySelector('.loginWithC');
showRegister.addEventListener('click', () => {
    panelC.classList.add('active');
    authBody.style.backgroundColor = "#fff";
    pageTitleC.style.color = "#444";
    lastEndPage.style.opacity = '1';
    lastEndPage.style.transition = 'opacity ease-in-out 1s';
    loginWithC.style.display = 'none';
});
showLogin.addEventListener('click', () => {
    panelC.classList.remove('active');
    authBody.style.backgroundColor = "#444";
    pageTitleC.style.color = "#fff";
    lastEndPage.style.opacity = '0';
    lastEndPage.style.transition = 'none';
    loginWithC.style.display = 'flex';
});
const changeLang = (e) => {
    document.cookie = 'lang=' + e.target.value;
    location.reload();
};

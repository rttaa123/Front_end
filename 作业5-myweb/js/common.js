// 登录页面功能
function initLoginPage() {
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        var isValid = true;
        var username = $('#username').val();
        if (!username) {
            $('#usernameError').show();
            isValid = false;
        } else {
            $('#usernameError').hide();
        }
        var password = $('#password').val();
        if (!password) {
            $('#passwordError').show();
            isValid = false;
        } else {
            $('#passwordError').hide();
        }
        if (isValid) {
            alert('登录成功！');
        }
    });
    $('#username, #password').on('input', function() {
        if ($(this).val()) {
            $(this).next('.error-message').hide();
        }
    });
    $('.social-btn.wechat').click(function() {
        alert('微信登录功能开发中...');
    });
    $('.social-btn.weibo').click(function() {
        alert('微博登录功能开发中...');
    });
}

// 注册页面功能
function initRegisterPage() {
    $('#password').on('input', function() {
        var password = $(this).val();
        var strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/[a-z]/.test(password)) strength += 10;
        if (/[A-Z]/.test(password)) strength += 10;
        if (/[0-9]/.test(password)) strength += 10;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
        strength = Math.min(strength, 100);
        $('#strengthBar').css('width', strength + '%');
        if (strength < 30) {
            $('#strengthText').text('密码强度：弱').css('color', '#e74c3c');
            $('#strengthBar').css('background', '#e74c3c');
        } else if (strength < 60) {
            $('#strengthText').text('密码强度：中').css('color', '#f39c12');
            $('#strengthBar').css('background', '#f39c12');
        } else if (strength < 80) {
            $('#strengthText').text('密码强度：强').css('color', '#2ecc71');
            $('#strengthBar').css('background', '#2ecc71');
        } else {
            $('#strengthText').text('密码强度：很强').css('color', '#27ae60');
            $('#strengthBar').css('background', '#27ae60');
        }
    });
    $('#username').on('blur', function() {
        var username = $(this).val();
        var usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
        if (usernameRegex.test(username)) {
            $('#usernameError').hide();
            $('#usernameSuccess').show();
            return true;
        } else {
            $('#usernameError').show();
            $('#usernameSuccess').hide();
            return false;
        }
    });
    $('#email').on('blur', function() {
        var email = $(this).val();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            $('#emailError').hide();
            return true;
        } else {
            $('#emailError').show();
            return false;
        }
    });
    $('#phone').on('blur', function() {
        var phone = $(this).val();
        var phoneRegex = /^1[3-9]\d{9}$/;
        if (phoneRegex.test(phone)) {
            $('#phoneError').hide();
            return true;
        } else {
            $('#phoneError').show();
            return false;
        }
    });
    $('#confirmPassword').on('blur', function() {
        var password = $('#password').val();
        var confirmPassword = $(this).val();
        if (password === confirmPassword) {
            $('#confirmPasswordError').hide();
            return true;
        } else {
            $('#confirmPasswordError').show();
            return false;
        }
    });
    var countdown = 0;
    $('#sendCodeBtn').click(function() {
        var phone = $('#phone').val();
        var phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            alert('请输入正确的手机号码');
            return;
        }
        if (countdown > 0) return;
        $(this).addClass('disabled').text('60秒后重新发送');
        countdown = 60;
        var timer = setInterval(function() {
            countdown--;
            $('#sendCodeBtn').text(countdown + '秒后重新发送');
            if (countdown <= 0) {
                clearInterval(timer);
                $('#sendCodeBtn').removeClass('disabled').text('发送验证码');
            }
        }, 1000);
        alert('验证码已发送到您的手机');
    });
    $('#registerForm').submit(function(e) {
        e.preventDefault();
        var isValid = true;
        if (!$('#username').triggerHandler('blur')) isValid = false;
        if (!$('#email').triggerHandler('blur')) isValid = false;
        if (!$('#phone').triggerHandler('blur')) isValid = false;
        if (!$('#confirmPassword').triggerHandler('blur')) isValid = false;
        if (!$('#agreement').is(':checked')) {
            $('#agreementError').show();
            isValid = false;
        } else {
            $('#agreementError').hide();
        }
        var verification = $('#verification').val();
        if (!verification) {
            $('#verificationError').show();
            isValid = false;
        } else {
            $('#verificationError').hide();
        }
        if (isValid) {
            alert('注册成功！');
        }
    });
    $('input').on('input', function() {
        if ($(this).val()) {
            $(this).nextAll('.error-message').first().hide();
        }
    });
}

// 找回密码功能
function initForgotPasswordPage() {
    var currentStep = 1;
    var totalSteps = 3;
    function showStep(step) {
        $('.step-item').removeClass('active');
        $('.step-item').eq(step-1).addClass('active');
        $('.step-content').removeClass('active');
        $('.step-content').eq(step-1).addClass('active');
        $('#prevBtn').toggle(step > 1);
        $('#nextBtn').toggle(step < totalSteps);
        $('#submitBtn').toggle(step === totalSteps);
    }
    $('#nextBtn').click(function() {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    });
    $('#prevBtn').click(function() {
        currentStep--;
        showStep(currentStep);
    });
    function validateStep(step) {
        var isValid = true;
        if (step === 1) {
            var account = $('#account').val();
            if (!account) {
                $('#accountError').show();
                isValid = false;
            } else {
                $('#accountError').hide();
            }
        } else if (step === 2) {
            var code = $('#verifyCode').val();
            if (!code) {
                $('#codeError').show();
                isValid = false;
            } else {
                $('#codeError').hide();
            }
        }
        return isValid;
    }
    $('#sendVerifyCode').click(function() {
        var account = $('#account').val();
        if (!account) {
            alert('请输入手机号或邮箱');
            return;
        }
        var $btn = $(this);
        var countdown = 60;
        $btn.addClass('disabled').prop('disabled', true).text('60秒后重新发送');
        var timer = setInterval(function() {
            countdown--;
            $btn.text(countdown + '秒后重新发送');
            if (countdown <= 0) {
                clearInterval(timer);
                $btn.removeClass('disabled').prop('disabled', false).text('发送验证码');
            }
        }, 1000);
        alert('验证码已发送到您的手机');
    });
    $('#forgotForm').submit(function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            alert('密码重置成功！');
        }
    });
    $('.forgot-input').on('input', function() {
        $(this).next('.error-message').hide();
    });
}

// 个人中心功能
function initUserCenterPage() {
    $('#avatarUpload').change(function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#avatarImg').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    $('.user-menu a').click(function(e) {
        e.preventDefault();
        $('.user-menu a').removeClass('active');
        $(this).addClass('active');
        var section = $(this).data('section');
        $('.user-section').removeClass('active');
        $('#' + section).addClass('active');
    });
}

// 我的文章功能
function initMyArticlesPage() {
    $('.action-btn.delete').click(function(e) {
        e.preventDefault();
        if (confirm('确定要删除这篇文章吗？')) {
            $(this).closest('.article-item').remove();
            alert('文章已删除');
        }
    });
    $('.search-btn').click(function() {
        var keyword = $('.search-box input').val();
        alert('搜索关键词: ' + keyword);
    });
    $('.pagination a').click(function(e) {
        e.preventDefault();
        $('.pagination a').removeClass('active');
        $(this).addClass('active');
    });
}

// 页面初始化
$(document).ready(function() {
    if ($('#loginForm').length) initLoginPage();
    if ($('#registerForm').length) initRegisterPage();
    if ($('#forgotForm').length) initForgotPasswordPage();
    if ($('#userCenter').length) initUserCenterPage();
    if ($('#myArticles').length) initMyArticlesPage();
});
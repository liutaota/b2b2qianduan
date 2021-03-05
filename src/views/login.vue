<template>
  <div class="login-container">
    <div class="login-wrap">
      <div class="login-left">
        <div class="logo-wrap">
          <img src="../assets/img/图层 2.png" alt="">
          <h3>中天医药报货管理后台</h3>
        </div>
        <span class="version">{{ version }}</span>
      </div>
      <div class="login-right">
        <div class="login-form-wrap">
          <div class="login-form">
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
              autocomplete="on"
              label-position="left"
            >
              <div class="title-container">
                <h3 class="title">欢迎登录</h3>
              </div>
              <el-form-item prop="username">
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
                <el-input
                  ref="username"
                  v-model.trim="loginForm.userName"
                  placeholder="用户名"
                  name="username"
                  type="text"
                  tabindex="1"
                  autocomplete="on"
                />
              </el-form-item>

              <el-tooltip v-model.trim="capsTooltip" content="已开启键盘大写" placement="right" manual>
                <el-form-item prop="password">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model.trim="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </el-form-item>
              </el-tooltip>

              <el-button
                :loading="loading"
                type="primary"
                style="width:348px;height:40px;;margin-bottom:30px;background:rgba(26,148,221,1);font-size:14px"
                @click.native.prevent="handleLogin"
              >提交</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';
import { setToken } from '@/utils/auth';
import { version } from '@/config';
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'));
      } else {
        callback();
      }
    };
    return {
      version: version,
      loginForm: {
        userName: '',
        password: '',
      },
      loginRules: {
        userName: [
          { required: true, trigger: 'blur', validator: validateUsername },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: null,
    };
  },
  watch: {
    $route: {
      handler: (route) => {
        const query = route.query;
        if (query) {
          // this.redirect = query.redirect;
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus();
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z';
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return false;
        this.loading = true;
        const param = new URLSearchParams();
        const grant_type = 'user_token';
        param.append('grant_type', grant_type);
        param.append('userName', this.loginForm.userName);
        param.append('password', this.loginForm.password);
        this.$http
          .post('/oauth/token', param)
          .then((data) => {
            this.loading = false;
            setToken(`${data.token_type} ${data.access_token}`);
            this.$router.push('/home');
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>

<style lang="scss">
$bg: #fff;
$light_gray: #9F9F9F;
$cursor: #9F9F9F;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border-bottom: 1px solid #E6E6E6;
    color: #AAAAAA;
  }
  // 登陆盒子
  .login-wrap{
    width: 776px;
    height: 474px;
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    box-shadow:0px 0px 51px 0px rgba(14,65,90,1);
    opacity:0.99;
    background:rgba(26,148,221,1);
    // 左侧盒子
    .login-left{
      width: 50%;
      background: #1A94DD;
      position: relative;
      .logo-wrap{
        width: 388px;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        img {
          width: 139px;
          height: 101px;
        }
        h3 {
          margin: 50px 0;
          color: #fff;
          font-size: 28px;
          font-weight:500;
          color:rgba(255,255,255,1);
        }
      }
      .version{
        position:absolute;
        left: 10px;
        bottom: 10px;
        color: #e6e6e67a;
      }
    }
    // 右侧盒子
    .login-right{
      width: 388px;
      background: #fff;
      h3 {
          font-family:Source Han Sans CN;
          margin: 0;
          padding: 0;
        }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #808080;
$light_gray: #808080;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('../assets/img/83abd03d629a7.png') no-repeat;
  background-size: 100% 100%;
  background-position: center;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    overflow: hidden;
    padding: 15% 10px;
  }

  .tips {
    font-size: 14px;
    color: #AAAAAA;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 24px;
      color:rgba(26,26,26,1);
      margin: 0px auto 20px auto;
      text-align: left;
      font-weight:400;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

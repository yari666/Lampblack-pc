<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" />
      </div>
      <!--登录区表单-->
      <el-form
        ref="loginFormRef"
        :model="loginform"
        :rules="loginFormRules"
        class="login_form"
        label-width="0px"
      >
        <!--用户名-->
        <el-form-item prop="UserName">
          <el-input placeholder="用户名" v-model="loginform.UserName" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="Password">
          <el-input
            placeholder="密码"
            v-model="loginform.Password"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!--按钮区-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import userLogin from '@/api/login/login'
export default {
    data() {
        return {
            loginform: {
                UserName: '',
                Password: '',
            },
            loginFormRules: {
                UserName: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur',
                    },
                ],
                Password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 15,
                        message: '长度在 6 到 15 个字符',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    created() {
        const that = this
        document.onkeydown = function (e) {
            if (window.event.keyCode === 13) {
                that.login()
            }
        }
    },
    methods: {
        // 点击重置按钮，重置登录表单
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
        login() {
            this.$router.push('/home')
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) {
                    return
                }

                const { data: result } = await userLogin(
                    this.$http,
                    this.loginform
                )

                console.log(result)

                if (result.resultCode === 0) {
                    // 保存token
                    // window.sessionStorage.setItem('token', result.result.accessToken)
                    window.sessionStorage.setItem(
                        'token',
                        result.data.accessToken
                    )
                    window.sessionStorage.setItem('userId', result.data.userId)
                    // 跳转到主页
                    this.$router.push('/home')
                    return this.$message.success('登录成功')
                } else {
                    return this.$message.error('登录失败')
                }
            })
        },
    },
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
    }
}

.btns {
    display: flex;
    justify-content: flex-end;
}

.login_form {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>

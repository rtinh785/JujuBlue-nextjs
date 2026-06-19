import { msg } from '@lingui/core/macro'

export const AUTH_MESSAGE = {
    LOGIN_SUCCESS: msg`Đăng nhập thành công`,
    REGISTER_SUCCESS: msg`Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.`,
    FORGOT_PASSWORD_SUCCESS: msg`Vui lòng kiểm tra email để đặt lại mật khẩu.`,
    FORGOT_PASSWORD_FAILED: msg`Gửi email đặt lại mật khẩu thất bại.`,
    RESET_PASSWORD_SUCCESS: msg`Đặt lại mật khẩu thành công.`,
    RESET_PASSWORD_FAILED: msg`Đặt lại mật khẩu thất bại.`,
    RESET_LINK_INVALID: msg`Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.`,
    GENERIC_ERROR: msg`Đã xảy ra lỗi. Vui lòng thử lại.`,
    REGISTER_FAILED: msg`Đăng ký thất bại. Vui lòng thử lại.`,
    LOGIN_FAILED: msg`Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.`,
    LOGIN_REQUIRED: msg`Vui lòng đăng nhập để tiếp tục.`,
} as const

export const AUTH_LABEL = {
    GOOGLE_CONNECTING: msg`Đang kết nối...`,
    CONTINUE_WITH_GOOGLE: msg`Tiếp tục với Google`,
    LOGGING_IN: msg`Đang đăng nhập...`,
    LOGIN: msg`Đăng nhập`,
    FORGOT_PASSWORD: msg`Quên mật khẩu?`,
    SIGN_UP: msg`Đăng ký`,
    CREATING_ACCOUNT: msg`Đang tạo tài khoản...`,
    CREATE_ACCOUNT: msg`Tạo tài khoản`,
    SIGN_IN: msg`Đăng nhập`,
    SENDING: msg`Đang gửi...`,
    SEND: msg`Gửi`,
    SAVING: msg`Đang lưu...`,
    BACK_TO_SIGN_UP: msg`Quay lại đăng ký`,
} as const

export const AUTH_TEXT = {
    LOGIN_TITLE: msg`Chào mừng trở lại`,
    LOGIN_DESCRIPTION: msg`Nhập thông tin để đăng nhập vào tài khoản của bạn.`,
    OR: msg`hoặc`,
    EMAIL_LABEL: msg`Địa chỉ email`,
    EMAIL_PLACEHOLDER: 'name@example.com',
    PASSWORD_LABEL: msg`Mật khẩu`,
    PASSWORD_PLACEHOLDER: '........',
    NO_ACCOUNT: msg`Chưa có tài khoản?`,
    REGISTER_TITLE: msg`Rất vui được gặp bạn!`,
    REGISTER_DESCRIPTION: msg`Tạo tài khoản mới.`,
    CONFIRM_PASSWORD_LABEL: msg`Xác nhận mật khẩu`,
    ALREADY_HAVE_ACCOUNT: msg`Đã có tài khoản?`,
    FORGOT_PASSWORD_TITLE: msg`Quên mật khẩu?`,
    FORGOT_PASSWORD_DESCRIPTION: msg`Nhập địa chỉ email và chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn.`,
    RESET_PASSWORD_TITLE: msg`Đặt lại mật khẩu`,
    RESET_PASSWORD_DESCRIPTION: msg`Nhập mật khẩu mới của bạn`,
    NEW_PASSWORD_LABEL: msg`Mật khẩu mới`,
    CONFIRM_PASSWORD_PLACEHOLDER: msg`Nhập lại mật khẩu mới`,
} as const

export const AUTH_URL = {
    GOOGLE_LOGIN: 'http://localhost:4000/auth/google',
} as const

export const AUTH_BRAND = {
    LOGO: '/images/svg/logo.svg',
    LOGO_ALT: 'Juju Blue Logo',
    NAME: 'Juju Blue',
    TAGLINE: 'Elevate your discourse.',
} as const

export const AUTH_VALIDATION_MESSAGE = {
    EMAIL_REQUIRED: msg`Email là bắt buộc`,
    EMAIL_INVALID: msg`Email không hợp lệ`,
    PASSWORD_REQUIRED: msg`Mật khẩu là bắt buộc`,
    CONFIRM_PASSWORD_REQUIRED: msg`Xác nhận mật khẩu là bắt buộc`,
    PASSWORD_MIN: msg`Mật khẩu phải có ít nhất 6 ký tự`,
    NEW_PASSWORD_REQUIRED: msg`Mật khẩu mới là bắt buộc`,
    NEW_PASSWORD_MIN: msg`Mật khẩu phải có ít nhất 8 ký tự`,
    PASSWORDS_MUST_MATCH: msg`Mật khẩu không khớp`,
} as const

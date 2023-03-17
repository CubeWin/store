const bcrypt = require("bcryptjs");

const encryptPassword = async (pwd) => {
    let isEncrypt = false;
    let pwdHash = "";

    if (!(pwd.length < 4)) {
        const salt = await bcrypt.genSalt(10);
        pwdHash = await bcrypt.hash(pwd, salt);
        isEncrypt = true;
    }

    return { isEncrypt, pwdHash };
};

const matchPassword = async (pwd, pwdHash) => {
    return await bcrypt.compare(pwd, pwdHash);
};

module.exports = { encryptPassword, matchPassword };

module.exports = {
    type: "react-component",
    npm: {
        esModules: true,
        umd: {
            global: "ReactComboKeys",
            externals: {
                react: "React"
            }
        }
    }
};

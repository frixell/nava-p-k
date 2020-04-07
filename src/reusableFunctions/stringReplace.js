export const stringReplace = (str, a, b) => {
        while (str.indexOf(a) > -1) {
            str = str.replace(a ,b);
        }
        return str;
    }
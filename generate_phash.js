let password = prompt("Password:")
const hash = await Bun.password.hash(password);

console.log(hash);
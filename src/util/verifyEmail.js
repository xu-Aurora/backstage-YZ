const verifyEmail = (val) => {
  const emailPat =/^(.+)@(.+)$/;
  const matchArray = val.match(emailPat);
  if (!matchArray || matchArray === null) {
    return false;
  }
  return true;
}
export default verifyEmail
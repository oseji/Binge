import BingeLogo from "../assets/registration logo.svg";

const RegistrationPage = () => {
  return (
    <section id="registrationPage">
      <div
        className=" absolute h-full w-full top-0 left-0 bg-cover"
        style={{
          backgroundImage: 'url("/heroSection-bg.jpg")',
          backgroundSize: "100% 100%",
        }}
      ></div>

      <form className="registrationForm">
        <div className=" flex flex-col items-center">
          <img src={BingeLogo} alt="Binge Logo" className=" h-10" />
          <p className=" text-xl font-bold">Create an Account</p>
        </div>

        <div className=" flex flex-col gap-3 items-center text-sm">
          <div className="inputGrp">
            <label htmlFor="firstName">first name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Sandra"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="lastName">last name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Bloyd"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="phoneNumber">phone number</label>
            <input
              type="number"
              name="phoneNumber"
              id="name"
              placeholder="+234 7024341178"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="emailAddress">email address</label>
            <input
              type="email"
              name="emailAddress"
              id="emailAddress"
              placeholder="SandyB@gmail.com"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="password">password</label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="Sandra"
            />
          </div>

          <div className="inputGrp">
            <label htmlFor="confirmPassword">confirm password</label>
            <input
              type="text"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Sandra"
            />
          </div>
        </div>
      </form>
    </section>
  );
};

export default RegistrationPage;

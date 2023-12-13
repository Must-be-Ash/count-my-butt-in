const Footer = () => {
  return (
      <div className="flex flex-row items-center text-[10px] sm:text-sm p-2">
        By signing in you agreed to the
        <a
          className="mr-1 ml-1 font-bold flex flex-row"
          href="https://alive-pastry-274.notion.site/Terms-and-Conditions-e79bb18213964f49941c99d0db6da297"
          target="_blank"
        >
          Terms and Condition
        </a>{" "}
        and our
        <a
          className="ml-1 font-bold"
          href="https://alive-pastry-274.notion.site/Privacy-Policy-888b290c0a54448cb9a6444a4eff8a91"
          target="_blank"
        >
          Privacy Policy
        </a>{" "}
      </div>
  )
}

export default Footer;
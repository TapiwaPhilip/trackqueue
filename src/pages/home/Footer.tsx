
const Footer = () => {
  return (
    <footer className="py-8 border-t border-nightStroke">
      <div className="container px-4 mx-auto text-center">
        <p className="text-sm text-nightMuted">
          © {new Date().getFullYear()} QTracker - Real-time nightclub queue tracking
        </p>
      </div>
    </footer>
  );
};

export default Footer;

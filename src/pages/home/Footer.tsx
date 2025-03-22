
import CountrySelector from "@/components/CountrySelector";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-nightStroke">
      <div className="container px-4 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-nightMuted">
          © {new Date().getFullYear()} TrackQueue - Real-time nightclub queue tracking
        </p>
        <CountrySelector />
      </div>
    </footer>
  );
};

export default Footer;

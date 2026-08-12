/**
 * Shared footer used by the landing page and every worker-rendered Rule
 * Guide page. Plain <a> tags (not react-router's Link) so it works
 * identically whether hydrated or rendered statically by the Worker.
 */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__contact-label">Contact us</p>
          <a className="site-footer__email" href="mailto:support@immio.app">
            support@immio.app
          </a>
        </div>
        <div className="site-footer__cols">
          <div className="site-footer__col">
            <a className="site-footer__link" href="/terms">
              Terms
            </a>
            <a className="site-footer__link" href="/privacy">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

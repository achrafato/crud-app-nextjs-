
import "./footer.scss"

const Footer = () =>
{
	return (
			<footer className="footer">
				<p>&copy; {new Date().getFullYear()} CRUD APP. All Rights Reserved.</p>
			</footer>
	);
}

export default Footer;
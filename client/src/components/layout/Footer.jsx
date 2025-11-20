export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Dance For Change</h3>
            <p className="text-muted-foreground text-sm">
              Promoting mental health and well-being through dance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-primary">About Us</a></li>
              <li><a href="/room" className="hover:text-primary">MindTalk</a></li>
              <li><a href="/dancers" className="hover:text-primary">Our Dancers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Email: info@danceforchange.org
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Dance For Change. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


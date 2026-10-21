export default function Footer(){
    return(
        <footer className="bg-surface-container-lowest w-full py-xl border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-gutter flat no shadows">
            <div className="font-headline-md text-headline-md font-bold text-on-surface">
            GLITCH_CORE
        </div>
        <div className="flex gap-lg">
        <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Politicas de privacidad</a>
        <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terminos de servicio</a>
        <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Soporte</a>
        <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Contacto</a>
        </div>
        <div className="font-label-sm text-label-sm text-on-surface-variant">
            © 2024 GLITCH_CORE. TODOS LOS DERECHOS RESERVADOS.
        </div>
        </footer>
    );
}
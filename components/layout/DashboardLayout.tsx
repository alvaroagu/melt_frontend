import { mainMenu } from "@/lib/navigation";
import Sidebar from "../Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="min-h-screen">
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors">
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  try {
    var ls = null;
    try { ls = localStorage.getItem('theme'); } catch (e) { /* ignore */ }
    var preferDark = false;
    try { preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) {}
    if (ls === 'dark' || (!ls && preferDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      window.__themeChangeAllowed = false;
      (function(){
        var origAdd = DOMTokenList.prototype.add;
        var origRemove = DOMTokenList.prototype.remove;
        var origToggle = DOMTokenList.prototype.toggle;
        DOMTokenList.prototype.add = function(){
          for (var i=0;i<arguments.length;i++){
            if (arguments[i] === 'dark'){
              if (!window.__themeChangeAllowed){
                console.warn('[theme-guard] blocked add("dark")');
                return;
              }
            }
          }
          return origAdd.apply(this, arguments);
        };
        DOMTokenList.prototype.remove = function(){
          for (var i=0;i<arguments.length;i++){
            if (arguments[i] === 'dark'){
              if (!window.__themeChangeAllowed){
                console.warn('[theme-guard] blocked remove("dark")');
                return;
              }
            }
          }
          return origRemove.apply(this, arguments);
        };
        DOMTokenList.prototype.toggle = function(token, force){
          if (token === 'dark'){
            if (!window.__themeChangeAllowed){
              console.warn('[theme-guard] blocked toggle("dark")', force);
              if (typeof force !== 'undefined'){
                return force;
              }
              return this.contains('dark');
            }
          }
          return origToggle.apply(this, arguments);
        };
      })();
    } catch (e) { }

    try {
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        (function(){
          var origAdd2 = DOMTokenList.prototype.add;
          var origRemove2 = DOMTokenList.prototype.remove;
          var origToggle2 = DOMTokenList.prototype.toggle;
          DOMTokenList.prototype.add = function(){
            for (var i=0;i<arguments.length;i++){
              if (arguments[i] === 'dark'){
                console.log('[theme-instrumentation] DOMTokenList.add dark', new Error().stack);
              }
            }
            return origAdd2.apply(this, arguments);
          };
          DOMTokenList.prototype.remove = function(){
            for (var i=0;i<arguments.length;i++){
              if (arguments[i] === 'dark'){
                console.log('[theme-instrumentation] DOMTokenList.remove dark', new Error().stack);
              }
            }
            return origRemove2.apply(this, arguments);
          };
          DOMTokenList.prototype.toggle = function(token, force){
            if (token === 'dark'){
              console.log('[theme-instrumentation] DOMTokenList.toggle dark', force, new Error().stack);
            }
            return origToggle2.apply(this, arguments);
          };
          var prevClass = document.documentElement.className;
          new MutationObserver(function(mutations){
            mutations.forEach(function(m){
              var current = document.documentElement.className;
              if (prevClass !== current){
                if (current.indexOf('dark') !== -1 && prevClass.indexOf('dark') === -1){
                  console.log('[theme-instrumentation] dark added via mutation', prevClass, '=>', current, new Error().stack);
                } else if (current.indexOf('dark') === -1 && prevClass.indexOf('dark') !== -1){
                  console.log('[theme-instrumentation] dark removed via mutation', prevClass, '=>', current, new Error().stack);
                }
                prevClass = current;
              }
            });
          }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        })();
      }
    } catch (e) { }
  } catch (e) { }
})();` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(){
  try {
    var ls = null;
    try { ls = localStorage.getItem('theme'); } catch (e) { /* ignore */ }
    var preferDark = false;
    try { preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) {}
    if (ls === 'dark' || (!ls && preferDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        (function(){
          var origAdd = DOMTokenList.prototype.add;
          var origRemove = DOMTokenList.prototype.remove;
          var origToggle = DOMTokenList.prototype.toggle;
          DOMTokenList.prototype.add = function(){
            for (var i=0;i<arguments.length;i++){
              if (arguments[i] === 'dark'){
                console.log('[theme-instrumentation] DOMTokenList.add dark', new Error().stack);
              }
            }
            return origAdd.apply(this, arguments);
          };
          DOMTokenList.prototype.remove = function(){
            for (var i=0;i<arguments.length;i++){
              if (arguments[i] === 'dark'){
                console.log('[theme-instrumentation] DOMTokenList.remove dark', new Error().stack);
              }
            }
            return origRemove.apply(this, arguments);
          };
          DOMTokenList.prototype.toggle = function(token, force){
            if (token === 'dark'){
              console.log('[theme-instrumentation] DOMTokenList.toggle dark', force, new Error().stack);
            }
            return origToggle.apply(this, arguments);
          };
          var prevClass = document.documentElement.className;
          new MutationObserver(function(mutations){
            mutations.forEach(function(m){
              var current = document.documentElement.className;
              if (prevClass !== current){
                if (current.indexOf('dark') !== -1 && prevClass.indexOf('dark') === -1){
                  console.log('[theme-instrumentation] dark added via mutation', prevClass, '=>', current, new Error().stack);
                } else if (current.indexOf('dark') === -1 && prevClass.indexOf('dark') !== -1){
                  console.log('[theme-instrumentation] dark removed via mutation', prevClass, '=>', current, new Error().stack);
                }
                prevClass = current;
              }
            });
          }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        })();
      }
    } catch (e) { /* ignore */ }
  } catch (e) { /* ignore all */ }
})();` }} />
        <div className="min-h-screen w-full flex">
          <Sidebar menu={mainMenu} />
          <main className="flex-1 min-h-screen">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-end mb-4">
                <ThemeToggle />
              </div>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

interface GraffitiEffect {
    selector: string;
    css: string;
    description: string;
}

class WebsiteGraffiti {
    private openaiApiKey: string = '';
    private originalHTML: string = '';
    private graffitiWindow: Window | null = null;

    constructor() {
        this.initializeApiKey();
    }

    private initializeApiKey(): void {
        this.openaiApiKey = prompt('Enter your OpenAI API key:') || '';
        if (!this.openaiApiKey) {
            alert('API key required to proceed!');
            return;
        }
    }

    public async startGraffiti(): Promise<void> {
        try {
            console.log('🎨 Starting website graffiti...');

            // Clone the current page
            this.originalHTML = document.documentElement.outerHTML;

            // Generate graffiti effects using OpenAI
            const effects = await this.generateGraffitiEffects();

            // Apply effects and show modified version
            this.displayGraffitiVersion(effects);

        } catch (error: any) {
            console.error('Graffiti error:', error);
            alert('Failed to create graffiti version: ' + (error?.message || error));
        }
    }

    private async generateGraffitiEffects(): Promise<GraffitiEffect[]> {
        const pageAnalysis = this.analyzePage();

        const prompt = `You are a street graffiti artist creating subtle but cool digital tags and effects. Make this website look tagged with spray paint and stickers, but keep it readable and not overwhelmingly bright.

Page elements found: ${pageAnalysis.elements.join(', ')}
Colors found: ${pageAnalysis.colors.join(', ')}

Create 6-8 CSS effects as JSON array with this format:
[
  {
    "selector": "button",
    "css": "border: 2px solid rgba(255,0,255,0.6) !important; background: linear-gradient(45deg, rgba(255,0,128,0.3), rgba(128,0,255,0.3)) !important; border-radius: 20px !important; box-shadow: 0 0 12px rgba(0,255,255,0.3) !important; animation: melt 4s ease-in-out infinite alternate !important; position: relative !important;",
    "description": "Subtle melting spray-painted buttons"
  }
]

Create GRAFFITI effects with MODERATE brightness:
- Use rgba() colors with 0.3-0.7 opacity instead of solid bright colors
- Paint drips and melting animations (gentle transforms)
- Spray paint glow effects (subtle box-shadows, not blinding)
- Graffiti-style text shadows (multiple layers but translucent)
- Tag borders and outlines (dashed/dotted borders)
- Glitch animations (rapid but subtle color changes)
- Sticker effects (colorful borders, background gradients)

Include these CSS animations in your responses:
@keyframes melt { 0% { border-radius: 20px; } 50% { border-radius: 0 0 40px 40px; } 100% { border-radius: 20px; } }
@keyframes glow { 0% { box-shadow: 0 0 5px rgba(255,255,255,0.2); } 50% { box-shadow: 0 0 15px rgba(255,255,255,0.4); } }
@keyframes glitch { 0% { text-shadow: 1px 0 rgba(255,0,255,0.4); } 50% { text-shadow: -1px 0 rgba(0,255,255,0.4); } }
@keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

Make it look like:
- Street art tags but not neon signs
- Cool spray paint effects that enhance, don't overwhelm
- Underground aesthetic but still functional
- Authentic graffiti colors: hot pink, electric blue, lime green, but with transparency

Use these color ranges with transparency:
- rgba(255,0,255,0.4-0.7) - Hot pink
- rgba(0,255,255,0.4-0.7) - Cyan  
- rgba(255,255,0,0.3-0.6) - Yellow
- rgba(255,0,128,0.4-0.7) - Deep pink
- rgba(0,255,0,0.4-0.7) - Lime green

Keep text readable! Focus on borders, backgrounds, and subtle glows rather than bright text colors.

Return only valid JSON, no other text.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.9
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data: OpenAIResponse = await response.json();
        const content = data.choices[0].message.content;

        try {
            return JSON.parse(content);
        } catch (parseError: any) {
            // Fallback effects if AI response isn't valid JSON
            console.warn('Failed to parse AI response, using defaults:', parseError);
            return this.getDefaultEffects();
        }
    }

    private analyzePage(): { elements: string[], colors: string[] } {
        const elements = new Set<string>();
        const colors = new Set<string>();

        // Find common elements
        const commonSelectors = ['button', 'a', 'h1', 'h2', 'h3', 'input', 'div', 'nav', 'header'];
        commonSelectors.forEach(selector => {
            if (document.querySelector(selector)) {
                elements.add(selector);
            }
        });

        // Extract some colors from computed styles
        const sampleElements = document.querySelectorAll('*');
        for (let i = 0; i < Math.min(20, sampleElements.length); i++) {
            const style = getComputedStyle(sampleElements[i]);
            if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                colors.add(style.backgroundColor);
            }
            if (style.color && style.color !== 'rgba(0, 0, 0, 0)') {
                colors.add(style.color);
            }
        }

        return {
            elements: Array.from(elements),
            colors: Array.from(colors).slice(0, 5)
        };
    }

    private getDefaultEffects(): GraffitiEffect[] {
        return [
            {
                selector: 'button',
                css: 'border: 2px solid rgba(255,0,255,0.6) !important; background: linear-gradient(45deg, rgba(255,0,128,0.3), rgba(128,0,255,0.3)) !important; border-radius: 25px !important; box-shadow: 0 0 15px rgba(0,255,255,0.3), inset 0 0 10px rgba(255,255,255,0.1) !important; animation: melt 4s ease-in-out infinite alternate, glow 2s ease-in-out infinite !important; position: relative !important; overflow: hidden !important; font-weight: bold !important; text-shadow: 1px 1px 0 rgba(0,0,0,0.8), 0 0 8px rgba(255,255,255,0.4) !important;',
                description: 'Melting neon spray-painted buttons'
            },
            {
                selector: 'a',
                css: 'color: rgba(0,255,65,0.9) !important; text-decoration: none !important; text-shadow: 1px 0 rgba(255,0,255,0.5), -1px 0 rgba(0,255,255,0.5), 0 1px rgba(255,255,0,0.4), 0 0 8px rgba(0,255,65,0.3) !important; animation: glitch 3s linear infinite !important; position: relative !important; font-weight: bold !important; padding: 2px 6px !important; background: rgba(0,0,0,0.2) !important; border-radius: 6px !important;',
                description: 'Glitching graffiti tag links'
            },
            {
                selector: 'h1, h2, h3',
                css: 'position: relative !important; color: rgba(255,0,128,0.9) !important; text-shadow: 2px 2px 0 rgba(0,0,0,0.7), 3px 3px 0 rgba(0,255,255,0.4), 4px 4px 0 rgba(255,255,0,0.3), 0 0 12px rgba(255,0,255,0.3) !important; animation: glow 3s ease-in-out infinite alternate !important; background: linear-gradient(90deg, transparent, rgba(255,0,255,0.05), transparent) !important; padding: 8px !important; border-left: 3px solid rgba(0,255,255,0.5) !important; font-weight: 800 !important;',
                description: 'Graffiti bubble letter headers'
            },
            {
                selector: 'input, textarea',
                css: 'border: 2px solid rgba(0,255,0,0.6) !important; box-shadow: inset 0 0 10px rgba(255,0,255,0.2), 0 0 12px rgba(0,255,255,0.3) !important; background: linear-gradient(45deg, rgba(0,0,0,0.4), rgba(255,0,255,0.05)) !important; animation: flicker 4s ease-in-out infinite !important; color: rgba(0,255,0,0.9) !important; font-weight: bold !important; border-radius: 12px !important;',
                description: 'Flickering neon input fields'
            },
            {
                selector: 'img',
                css: 'filter: hue-rotate(120deg) saturate(1.4) contrast(1.2) !important; border: 2px solid rgba(255,0,255,0.5) !important; box-shadow: 0 0 15px rgba(0,255,255,0.4) !important; position: relative !important; animation: glow 2.5s ease-in-out infinite alternate !important; border-radius: 8px !important;',
                description: 'Color-shifted graffiti images'
            },
            {
                selector: 'p',
                css: 'position: relative !important; filter: contrast(1.1) saturate(1.1) !important; text-shadow: 0.5px 0.5px 1px rgba(0,255,255,0.2) !important; background: linear-gradient(90deg, transparent 97%, rgba(255,0,255,0.03) 100%) !important;',
                description: 'Subtly enhanced text'
            },
            {
                selector: 'nav, header, footer',
                css: 'position: relative !important; background: linear-gradient(45deg, rgba(255,0,255,0.05), rgba(0,255,255,0.05)) !important; border-top: 2px solid rgba(255,0,255,0.4) !important; border-bottom: 2px solid rgba(0,255,255,0.4) !important; box-shadow: 0 0 10px rgba(255,0,255,0.2) !important; animation: glow 4s ease-in-out infinite alternate !important;',
                description: 'Tagged navigation sections'
            },
            {
                selector: 'div:hover, section:hover',
                css: 'box-shadow: 0 0 12px rgba(0,255,255,0.3) !important; border: 1px dashed rgba(255,0,255,0.4) !important; background: linear-gradient(45deg, transparent, rgba(255,0,255,0.02), transparent) !important; transition: all 0.3s ease !important;',
                description: 'Subtle hover graffiti effects'
            }
        ];
    }

    private displayGraffitiVersion(effects: GraffitiEffect[]): void {
        // Create new window with modified content
        this.graffitiWindow = window.open('', '_blank', 'width=1200,height=800');

        if (!this.graffitiWindow) {
            alert('Please allow popups to see the graffiti version!');
            return;
        }

        // Create the CSS for effects
        const graffitiCSS = this.createGraffitiCSS(effects);

        // Write modified HTML to new window
        this.graffitiWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>🎨 GRAFFITIED: ${document.title}</title>
        <style>
          /* Original styles preserved */
          ${this.extractOriginalCSS()}
          
          /* Graffiti overlay styles */
          ${graffitiCSS}
          
          /* Global graffiti effects */
          body {
            position: relative;
            overflow-x: hidden;
            filter: contrast(1.05) saturate(1.1);
            background: linear-gradient(45deg, 
              rgba(255,0,255,0.01) 0%, 
              transparent 25%, 
              rgba(0,255,255,0.01) 50%, 
              transparent 75%, 
              rgba(255,255,0,0.01) 100%) !important;
          }
          
          body::before {
            content: "🎨 TAGGED";
            position: fixed;
            top: 15px;
            right: 15px;
            background: linear-gradient(45deg, rgba(255,0,128,0.8), rgba(128,0,255,0.8));
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 700;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 0 10px rgba(255,0,255,0.4), inset 0 0 5px rgba(255,255,255,0.1);
            border: 1px solid rgba(0,255,255,0.6);
            animation: glow 2s ease-in-out infinite alternate, neonPulse 3s ease-in-out infinite;
            text-shadow: 1px 1px 0 rgba(0,0,0,0.8), 0 0 5px rgba(255,255,255,0.4);
          }
          
          body::after {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle at 10% 20%, rgba(255,0,255,0.03) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(0,255,255,0.03) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(255,255,0,0.02) 0%, transparent 60%);
            pointer-events: none;
            z-index: -1;
            animation: flicker 8s ease-in-out infinite;
          }
          
          /* Subtle graffiti elements */
          *:nth-child(13n)::before {
            content: "💀";
            position: absolute;
            top: -3px;
            right: -3px;
            font-size: 10px;
            z-index: 10;
            color: rgba(255,0,255,0.6);
            animation: flicker 4s ease-in-out infinite;
            text-shadow: 0 0 3px rgba(255,0,255,0.4);
          }
          
          *:nth-child(17n)::after {
            content: "⚡";
            position: absolute;
            bottom: -3px;
            left: -3px;
            font-size: 8px;
            z-index: 10;
            color: rgba(0,255,255,0.6);
            animation: glow 3s ease-in-out infinite;
          }
        </style>
      </head>
      <body>
        ${document.body.innerHTML}
        
        <div style="position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.8); color: #00ff00; padding: 10px; border-radius: 10px; font-family: monospace; font-size: 12px; z-index: 9999; max-width: 300px;">
          <strong>Graffiti Effects Applied:</strong><br>
          ${effects.map(effect => `• ${effect.description}`).join('<br>')}
        </div>
      </body>
      </html>
    `);

        this.graffitiWindow.document.close();
        console.log('🎨 Graffiti version created!');
    }

    private createGraffitiCSS(effects: GraffitiEffect[]): string {
        const animations = `
      @keyframes melt {
        0% { border-radius: 25px; transform: translateY(0); }
        50% { border-radius: 0 0 50px 50px; transform: translateY(2px); }
        100% { border-radius: 25px; transform: translateY(0); }
      }
      
      @keyframes glow {
        0% { box-shadow: 0 0 3px rgba(255,255,255,0.2); }
        50% { box-shadow: 0 0 12px rgba(255,255,255,0.4), 0 0 18px rgba(255,255,255,0.2); }
        100% { box-shadow: 0 0 3px rgba(255,255,255,0.2); }
      }
      
      @keyframes glitch {
        0% { text-shadow: 1px 0 rgba(255,0,255,0.4), -1px 0 rgba(0,255,255,0.4); }
        25% { text-shadow: -1px 0 rgba(0,255,255,0.4), 1px 0 rgba(255,255,0,0.3); }
        50% { text-shadow: 1px 0 rgba(255,255,0,0.3), -1px 0 rgba(255,0,128,0.4); }
        75% { text-shadow: -1px 0 rgba(255,0,128,0.4), 1px 0 rgba(0,255,0,0.3); }
        100% { text-shadow: 1px 0 rgba(255,0,255,0.4), -1px 0 rgba(0,255,255,0.4); }
      }
      
      @keyframes drip {
        0% { clip-path: polygon(0 0, 100% 0, 100% 85%, 0 85%); }
        100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
      }
      
      @keyframes flicker {
        0%, 100% { opacity: 1; filter: brightness(1); }
        25% { opacity: 0.8; filter: brightness(1.2); }
        50% { opacity: 0.6; filter: brightness(0.8); }
        75% { opacity: 0.9; filter: brightness(1.1); }
      }
      
      @keyframes spray {
        0% { box-shadow: 0 0 6px rgba(255,0,255,0.3); }
        33% { box-shadow: 0 0 10px rgba(0,255,255,0.4), 0 0 15px rgba(255,255,0,0.2); }
        66% { box-shadow: 0 0 8px rgba(255,0,128,0.35), 0 0 12px rgba(0,255,0,0.25); }
        100% { box-shadow: 0 0 6px rgba(255,0,255,0.3); }
      }
      
      @keyframes neonPulse {
        0%, 100% { text-shadow: 0 0 3px rgba(255,255,255,0.3), 0 0 6px rgba(255,255,255,0.2); }
        50% { text-shadow: 0 0 6px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,0.3), 0 0 18px rgba(255,255,255,0.1); }
      }
    `;

        const effectsCSS = effects.map(effect => `
      ${effect.selector} {
        ${effect.css}
      }
      
      ${effect.selector}:hover {
        filter: ${effect.css.includes('filter:') ?
                effect.css.match(/filter:\s*([^;!]+)/)?.[1] + ' brightness(1.15) saturate(1.2)' :
                'brightness(1.15) saturate(1.2)'
            } !important;
        box-shadow: ${effect.css.includes('box-shadow:') ?
                effect.css.match(/box-shadow:\s*([^;!]+)/)?.[1] + ', 0 0 15px rgba(255,255,255,0.2)' :
                '0 0 12px rgba(255,255,255,0.3)'
            } !important;
        animation: ${effect.css.includes('animation:') ?
                effect.css.match(/animation:\s*([^;!]+)/)?.[1] + ', spray 1.5s ease-in-out infinite' :
                'spray 1.5s ease-in-out infinite'
            } !important;
        transition: all 0.2s ease !important;
        transform: scale(1.01) !important;
      }
    `).join('\n');

        return animations + '\n' + effectsCSS;
    }

    private extractOriginalCSS(): string {
        let css = '';

        // Get inline styles
        Array.from(document.styleSheets).forEach(sheet => {
            try {
                Array.from(sheet.cssRules || sheet.rules).forEach(rule => {
                    css += rule.cssText + '\n';
                });
            } catch (corsError: any) {
                // Skip external stylesheets due to CORS
                console.log('Skipped external stylesheet:', sheet.href);
            }
        });

        return css;
    }
}

// Bookmarklet execution
(function () {
    const graffiti = new WebsiteGraffiti();
    graffiti.startGraffiti();
})();

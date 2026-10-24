declare function require(moduleName: 'fs'): {
  readFileSync: (file: string, encoding: 'utf8') => string;
};

const readFileSync = require('fs').readFileSync;

function readProjectFile(file: string) {
  return readFileSync(file, 'utf8');
}

describe('tela nativa de abertura', () => {
  describe('dado os projetos nativos', () => {
    test('CA-07: quando a tela de abertura do sistema é inspecionada, então o fundo é preto e não há texto de placeholder', () => {
      const storyboard = readProjectFile('ios/AppFiap/LaunchScreen.storyboard');
      const colors = readProjectFile(
        'android/app/src/main/res/values/colors.xml',
      );
      const styles = readProjectFile(
        'android/app/src/main/res/values/styles.xml',
      );
      const stylesV31 = readProjectFile(
        'android/app/src/main/res/values-v31/styles.xml',
      );

      expect(storyboard).toContain(
        'red="0.0" green="0.0" blue="0.0" alpha="1"',
      );
      expect(storyboard).not.toContain('Powered by React Native');
      expect(storyboard).not.toContain('>AppFiap<');
      expect(colors).toContain('#000000');
      expect(styles).toContain('@color/splash_background');
      expect(styles).toContain('AppTheme.Base');
      expect(stylesV31).toContain('parent="AppTheme.Base"');
      expect(stylesV31).toContain('android:windowSplashScreenBackground');
      expect(stylesV31).toContain('@drawable/splash_empty');
    });
  });
});

export {};

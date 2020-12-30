import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Linux Distro',
    imageUrl: 'img/undraw_computer.svg',
    description: (
      <>
			  AsahiLinux is designed to be an arm64 arch based distribution. We don't want to run our own package repositories, etc.
				We just want this to run well on our new M1-based hardware.
      </>
    ),
  },
  {
    title: 'Easy Install',
    imageUrl: 'img/undraw_install.svg',
    description: (
      <>
			  While there probably won't be a fancy GUI installer, we do plan on getting install scripts polished, so that
				almost anyone with the requisite hardware and will can pull it off.
      </>
    ),
  },
  {
    title: 'Prior Linux Porting Experience',
    imageUrl: 'img/undraw_code.svg',
    description: (
      <>
			  <a href="https://github.com/marcan" alt="marcan Github" target="_blank" rel="noreferrer noopener">@marcan</a> is the guy behind the <a href="https://www.youtube.com/watch?v=QMiubC6LdTA" alt="Youtube - Console Hacking 2016" target="_blank" rel="noreferrer noopener">Linux on PS4</a> project who loves putting Linux on things.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={siteConfig.title}
      description="Linux on Apple Silicon based Macs">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;

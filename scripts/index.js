document.documentElement.classList.add('js');

const splashScreen = document.querySelector('#splash-screen');

splashScreen?.addEventListener('animationend', (event) => {
	if (event.animationName === 'splash-display') {
		splashScreen.remove();
	}
}, { once: true });

const revealItems = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const time_delay = 1900;

const showRevealItems = () => {
	revealItems.forEach((item) => item.classList.add('is-visible'));
	};

const startCodeTyping = () => {
	const codeElement = document.querySelector('.code-block code');

	if (!codeElement || codeElement.dataset.typingStarted === 'true') {
		return;
	}

	codeElement.dataset.typingStarted = 'true';
	codeElement.setAttribute('aria-label', codeElement.textContent.trim());
	const textNodes = [];
	const nodeWalker = document.createTreeWalker(codeElement, NodeFilter.SHOW_TEXT);
	let currentNode;

	while ((currentNode = nodeWalker.nextNode())) {
		textNodes.push({ node: currentNode, text: currentNode.textContent });
		currentNode.textContent = '';
	}

	codeElement.classList.add('is-typing');
	let nodeIndex = 0;
	let characterIndex = 0;

	const typeNextCharacter = () => {
		if (nodeIndex >= textNodes.length) {
			codeElement.classList.remove('is-typing');
			return;
		}

		const currentTextNode = textNodes[nodeIndex];
		currentTextNode.node.textContent += currentTextNode.text[characterIndex];
		characterIndex += 1;

		if (characterIndex >= currentTextNode.text.length) {
			nodeIndex += 1;
			characterIndex = 0;
		}

		window.setTimeout(typeNextCharacter, 18);
	};

	typeNextCharacter();
};

const startRevealObserver = () => {
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}

			entry.target.classList.add('is-visible');
			if (entry.target.classList.contains('main-panel')) {
				startCodeTyping();
			}
			observer.unobserve(entry.target);
		});
	}, {
		rootMargin: '0px 0px -10% 0px',
		threshold: 0.12,
	});

	revealItems.forEach((item) => revealObserver.observe(item));
};

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
	showRevealItems();
} else {
	window.addEventListener('load', () => {
		window.setTimeout(startRevealObserver, time_delay);
	}, { once: true });
}

if (!prefersReducedMotion) {
	const heroElements = [
		['.hero .banner-img', -0.08],
		['.hero .banner-img1', 0.06],
		['.hero .banner-text.down', 0.06],
		['.hero .label-fs', -0.04],
		['.hero .label-dev', 0.05],
		['.hero .label-dev2', 0.05],
	];
	let ticking = false;

	const updateHeroMotion = () => {
		const scrollOffset = Math.min(window.scrollY, window.innerHeight);

		heroElements.forEach(([selector, speed]) => {
			const element = document.querySelector(selector);
			if (element) {
				element.style.translate = `0 ${scrollOffset * speed}px`;
			}
		});

		ticking = false;
	};

	window.addEventListener('scroll', () => {
		if (!ticking) {
			window.requestAnimationFrame(updateHeroMotion);
			ticking = true;
		}
	}, { passive: true });
}

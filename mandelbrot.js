/**
 * @author Dave
 */

var MAX_ITERATIONS = 255;

var iterationTimer = 0, colorationTimer = 0;
/**
 * Get the number of steps required (or MAX_ITERATIONS) to prove the Complex will diverge.
 * @return {Number}
 */
function mandelbrot(real, imaginary) {
	var cr = real,
		ci = imaginary,
		xr = real,
		xi = imaginary,
		t = 0,
		i = MAX_ITERATIONS,
		timeIn = (new Date).valueOf();
	
	while (xr > -2 && xr < 2 && xi > -2 && xi < 2 && i--) {
		t = xr*xr - xi*xi + cr;
		xi = 2*xr*xi + ci;
		xr = t;
	}
	
	iterationTimer += (new Date).valueOf() - timeIn;
	
	return MAX_ITERATIONS - i;
};

var sin = Math.sin, cos = Math.cos, angleRatio = Math.PI/(2*MAX_ITERATIONS), floor = Math.floor;

function incPrecision() {
	angleRatio = Math.PI/(2*++MAX_ITERATIONS);
}
function decPrecision() {
	angleRatio = Math.PI/(2*--MAX_ITERATIONS);
}

var colorize;

function colorizeRotate(o, i) {
	o = o || {r: 0, g: 0, b: 0};
	
	if (i >= MAX_ITERATIONS) {
		o.r = 0;
		o.g = 0;
		o.b = 0;
		return o;
	}
	
	var timeIn = (new Date).valueOf(),
		s = sin(i*angleRatio),
		c = cos(i*angleRatio),
		r = 1 - s - c;
	
	o.r = floor(c*255);
	o.g = floor(r*255);
	o.b = floor(s*255);
	
	colorationTimer += (new Date).valueOf() - timeIn;
	return o;
}

function colorizeGray(o, i) {
	o = o || {r: 0, g: 0, b: 0};
	
	var timeIn = (new Date).valueOf();
	
	i = floor(255*(MAX_ITERATIONS-i)/MAX_ITERATIONS);
	
	o.r = i;
	o.g = i;
	o.b = i;
	
	colorationTimer += (new Date).valueOf() - timeIn;
	return o;
}

colorize = colorizeGray;

function makeCanvasMandelbrot(canvas, l, t, r, b) {
	if (!canvas) {
		canvas = document.createElement('canvas');
		canvas.width = 800;
		canvas.height = 800;
	}
	
	t = (t !== undefined) ? t : -2;
	l = (l !== undefined) ? l : -2;
	b = (b !== undefined) ? b : 2;
	r = (r !== undefined) ? r : 2;
	var w = canvas.width.valueOf(),
		h = canvas.height.valueOf(),
		row = 0,
		col = 0,
		index = 0,
		xStep = (r - l)/w,
		yStep = (b - t)/h,
		x = l,
		y = t,
		imageData = canvas.getContext('2d').createImageData(w, h),
		pixels = imageData.data,
		m = 0,
		color = {r: 0, g: 0, b: 0};
	w = imageData.width;
	h = imageData.height;
	
	while (row++ < h) {
		col = 0;
		x = l;
		while (col++ < w) {
			m = mandelbrot(x, y);
			colorize(color, m);
			pixels[index++] = color.r;
			pixels[index++] = color.g;
			pixels[index++] = color.b;
			pixels[index++] = 255;
			x += xStep;
		}
		y += yStep;
	}
	
	canvas.getContext('2d').putImageData(imageData, 0, 0);
	return canvas;
}

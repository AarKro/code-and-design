/**
 * HandPose Boilerplate mit ml5.js
 * 
 * Dieses Sketch erkennt Hände über die Webcam und zeichnet die erkannten Keypoints.
 * Es dient als Ausgangspunkt für eigene Hand-Tracking-Projekte.
 * 
 * Dokumentation: https://docs.ml5js.org/#/reference/handpose
 * 
 * Jede Hand hat 21 Keypoints (0-20):
 * - 0: Handgelenk
 * - 1-4: Daumen
 * - 5-8: Zeigefinger
 * - 9-12: Mittelfinger
 * - 13-16: Ringfinger
 * - 17-20: Kleiner Finger
 */

// Globale Variablen
let handpose;           // Das ml5.js HandPose-Modell
let video;              // Die Webcam
let hands = [];         // Array mit allen erkannten Händen
let ratio;              // Skalierungsfaktor zwischen Video und Canvas
let isModelReady = false; // Flag, ob das Modell geladen und Hände erkannt wurden
let touchPoints = []; // Array für benutzerdefinierte Touch-Punkte
let touchPointDiameter = 60; // Durchmesser der Touch-Punkte

const HAND_COLLISION_POINT = "index_finger_tip"; // Index des Zeigefinger-Tipps im Keypoint-Array
const PINCH_POINTS = ["thumb_tip", "index_finger_tip"]; // Keypoints für Pinch-Geste
const keypointDiameter = 20; // Durchmesser der Keypoint-Kreise
let shouldPointsBeInvisible = false;

/**
 * Lädt das HandPose-Modell vor dem Setup
 * Diese Funktion wird automatisch vor setup() ausgeführt
 */
function preload() {
  handpose = ml5.handPose();
}

/**
 * Initialisiert Canvas und Webcam
 */
function setup() {
  colorMode(HSB);
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Performanceoptimierung
  
  // Webcam einrichten
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Versteckt das Standard-Video-Element
  
  // Berechne Skalierungsfaktor für Video-zu-Canvas-Anpassung
  ratio = width / video.width;
  
  // Starte Hand-Erkennung
  handpose.detectStart(video, gotHands);
}

/**
 * Hauptzeichnungs-Loop
 */
function draw() {
  background(220);

  // Spiegle die Darstellung horizontal (für intuitivere Interaktion)
  push();
  translate(width, 0);
  scale(-1, 1);

  //Zeige das Video (optional)
  //image(video, 0, 0, video.width * ratio, video.height * ratio);

  // Zeichne nur, wenn das Modell bereit ist und Hände erkannt wurden
  if (isModelReady) {
    drawHandPoints();
    
    if (!shouldPointsBeInvisible) {
      drawTouchPoints();
    }
    
    // removeTouchPointsOnCollision();

    if (isGrabbingTouchPoint()) {
      // update touchpoint pos based on pinch pos
      const hand = hands[0];
      const [p1, p2] = PINCH_POINTS.map(p => hand[p]);
      const pinchX = (p1.x + p2.x) / 2 * ratio;
      const pinchY = (p1.y + p2.y) / 2 * ratio;

      touchPoints[0].x = pinchX;
      touchPoints[0].y = pinchY;
    }

    if (isHoldingTouchPoint()) {
      // remove touch point
      shouldPointsBeInvisible = true;

      const hand = hands[0];
        
      if (hand == null) return;
      const wrist = hand["wrist"];
      touchPoints = [];
      touchPoints.push(
        createVector(
          wrist.x * ratio,
          wrist.y * ratio - 80
        )
      );
    } else {
      shouldPointsBeInvisible = false;
    }

    detectResize();
  } else {
    if (touchPoints.length === 0) {
      touchPoints.push(
        createVector(
          random(10 + touchPointDiameter, windowWidth - 10 - touchPointDiameter),
          random(10 + touchPointDiameter, windowHeight - 10 - touchPointDiameter),
        )
      );
    }
  }
  
  pop();
}

/**
 * Callback-Funktion für HandPose-Ergebnisse
 * Wird automatisch aufgerufen, wenn neue Hand-Daten verfügbar sind
 * 
 * @param {Array} results - Array mit erkannten Händen
 */
function gotHands(results) {
  hands = results;
  
  // Setze Flag, sobald erste Hand erkannt wurde
  if (hands.length > 0) {
    isModelReady = true;
  }
}

/**
 * Zeichnet alle erkannten Hand-Keypoints
 * Jede Hand hat 21 Keypoints (siehe Kommentar oben)
 */
function drawHandPoints() {
  // Durchlaufe alle erkannten Hände (normalerweise max. 2)
  const connections = handpose.getConnections();
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    const connectionsToKeypoints = connections.map(c => [hand.keypoints[c[0]], hand.keypoints[c[1]]]);
    connectionsToKeypoints.forEach(conn => {
      stroke(0);
      strokeWeight(10);
      line(conn[0].x * ratio, conn[0].y * ratio, conn[1].x * ratio, conn[1].y * ratio);
    });
  }

}

function drawTouchPoints() {
  fill(getTouchPointColor(), 80, 80);
  noStroke();
  touchPoints.forEach(tp => {
    circle(tp.x, tp.y, touchPointDiameter);
  });
}

function removeTouchPointsOnCollision() {
  const newTouchPoints = touchPoints.filter(tp => {
    return !hands.some(hand => {
      const keypoint = hand[HAND_COLLISION_POINT];
      const d = dist(tp.x, tp.y, keypoint.x * ratio, keypoint.y * ratio);
      if (d < (touchPointDiameter / 2 + keypointDiameter / 2)) {
        return true; 
      }

      return false;
    });
  });
  touchPoints = newTouchPoints;
}

function isGrabbingTouchPoint() {
  if (hands.length !== 1) return false;

  return touchPoints.some(tp => {
    return hands.some(hand => {
      const [p1, p2] = PINCH_POINTS.map(p => hand[p]);

      const pinchDistance = dist(p1.x * ratio, p1.y * ratio, p2.x * ratio, p2.y * ratio);
      const isPinching = pinchDistance < 60;
      if (isPinching) {
        const distanceToTouchPoint = dist(tp.x, tp.y, (p1.x + p2.x) / 2 * ratio, (p1.y + p2.y) / 2 * ratio);
        if (distanceToTouchPoint < (touchPointDiameter / 2 + keypointDiameter / 2)) {
          return true;
        }
      }
    });
  });
}

function isHoldingTouchPoint() {
  if (hands.length !== 1) return false;

  return touchPoints.some(tp => {
    return hands.some(hand => {
      const averageDistanceToWrist = Object.keys(hand)
        .filter(k =>  k.endsWith("_tip"))
        .filter(k =>  k !== "thumb_tip")
        .map(k => hand[k])
        .map(tip => {
          const wrist = hand["wrist"];
          return dist(wrist.x * ratio, wrist.y * ratio, tip.x * ratio, tip.y * ratio);
        })
        .reduce((sum, d) => sum + d, 0) / 4;

      if (averageDistanceToWrist < 250) {
        // is making a fist

        if (shouldPointsBeInvisible) return true;

        // get bounds of hands
        const bounds = hand.keypoints.reduce((bounds, keypoint) => {
          const x = keypoint.x * ratio;
          const y = keypoint.y * ratio;
          if (x < bounds.minX) bounds.minX = x;
          if (x > bounds.maxX) bounds.maxX = x;
          if (y < bounds.minY) bounds.minY = y;
          if (y > bounds.maxY) bounds.maxY = y;
          return bounds;
        }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

        if (tp.x > bounds.minX && tp.x < bounds.maxX && tp.y > bounds.minY && tp.y < bounds.maxY) {
          return true;
        }
      }
    });
  });
}

function detectResize() {
  if (hands.length !== 2) return;

  const fingerTips = hands.map(hand => hand["index_finger_tip"]);
  const firstFingerDistanceToTouchPoint = dist(fingerTips[0].x * ratio, fingerTips[0].y * ratio, touchPoints[0].x, touchPoints[0].y);
  const secondFingerDistanceToTouchPoint = dist(fingerTips[1].x * ratio, fingerTips[1].y * ratio, touchPoints[0].x, touchPoints[0].y);

  if (firstFingerDistanceToTouchPoint > touchPointDiameter / 2 || secondFingerDistanceToTouchPoint > touchPointDiameter / 2) return;

  const distanceBetweenFingers = dist(fingerTips[0].x * ratio, fingerTips[0].y * ratio, fingerTips[1].x * ratio, fingerTips[1].y * ratio);
  touchPointDiameter = distanceBetweenFingers + 30;
}

function getTouchPointColor() {
  const touchPoint = touchPoints[0];
  return map(touchPoint.x, 0, width, 0, 360);
}
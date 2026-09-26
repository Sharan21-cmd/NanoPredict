# NanoPredict

## Autonomous Sub-Nanometer Drift & Vacuum Anomaly Prediction in Lithography Equipment

NanoPredict is a hardware-software prototype designed to monitor precision lithography equipment, detect abnormal telemetry patterns, and provide an interpretable view of machine condition through a digital twin and AI assistant.

The system combines real-time Raspberry Pi telemetry, backend anomaly analysis, machine-state visualization, alerts, predictions, and an AI assistant into a single monitoring platform.

---

## Problem Statement

Modern semiconductor lithography equipment operates with extremely tight positioning and environmental tolerances. Small changes in vibration, temperature, pressure, or motion can develop into conditions that affect precision and equipment stability.

NanoPredict explores a low-cost prototype architecture for:

- Real-time machine telemetry monitoring
- Detection of abnormal sensor behavior
- Sub-nanometer-scale drift monitoring concepts
- Environmental and vibration monitoring
- Motor/position monitoring
- Risk and anomaly assessment
- Explainable machine-status queries
- Digital-twin visualization

---

# System Architecture

```text
                 PHYSICAL PROTOTYPE
                        │
        ┌───────────────┼────────────────┐
        │               │                │
   Accelerometer     DHT11           BMP280
   / Vibration      Temperature       Pressure
        │               │                │
        └───────────────┼────────────────┘
                        │
                   Raspberry Pi 4B
                        │
                 Real Telemetry
                        │
                        ▼
              NanoPredict Backend
                    FastAPI
                        │
            ┌───────────┴───────────┐
            │                       │
       Phase-2 Analysis       Machine Context
            │                       │
            ▼                       ▼
      Risk / Anomaly          AI Assistant
            │                       │
            └───────────┬───────────┘
                        │
                        ▼
              React + Three.js UI
                        │
          ┌─────────────┼─────────────┐
          │             │             │
      Telemetry     Digital Twin   Reports
      Dashboard                     & AlertsHardware Prototype

The physical prototype uses a Raspberry Pi 4B as the edge controller.

Hardware used
Raspberry Pi 4B
DHT11 temperature sensor
BMP280 pressure sensor
Accelerometer / vibration sensor
28BYJ-48 stepper motor
Motor control interface
LEDs for prototype status indication

The Raspberry Pi reads the physical sensors and generates real telemetry data that is transmitted to the NanoPredict backend.

Real Telemetry

The hardware integration currently provides real measurements such as:

Acceleration / vibration
Temperature
Pressure
Motor status
Motor step count
Motor position
Step rate

Example telemetry structure:

{
  "source": "raspberry_pi",
  "motor": {
    "status": "running",
    "step_count": 12019,
    "position_steps": 12019
  },
  "vibration": {
    "acceleration_g": 1.09
  },
  "environment": {
    "temperature_c": 28.56,
    "pressure_hpa": 909.00
  }
}

Note: The BMP280 provides pressure telemetry. In this prototype it is used as a pressure/chamber-pressure proxy and is not claimed to be a dedicated vacuum sensor.

Phase-2 Anomaly Detection

NanoPredict includes a Phase-2 telemetry analysis layer.

The predictor analyzes real Raspberry Pi telemetry and looks for abnormal patterns in:

Acceleration
Temperature
Pressure
Motor step rate
Rolling statistical behavior
Rate of change
Adaptive Baseline

The current prototype uses an adaptive statistical baseline that learns the normal behavior of the incoming real telemetry.

During startup, the system enters a warm-up period and collects recent sensor observations.

After sufficient samples are available, the system evaluates deviations from the learned baseline.

Risk levels are represented as:

NORMAL
WARNING
CRITICAL

The system also provides reasons for an elevated risk state when abnormal deviations are detected.

Optional ML Model Support

The Phase-2 predictor also contains support for loading a future trained model artifact such as an Isolation Forest model.

The current demonstrated pipeline uses the adaptive real-telemetry baseline rather than claiming a pre-trained model that has not been provided.

AI Assistant

NanoPredict contains an AI assistant that uses the current machine context.

The assistant can answer questions such as:

What is the current machine status?
What is the current anomaly risk?
Is there any anomaly in the current sensor data?
What are the current sensor values?
Why is the current risk level elevated?
Which telemetry parameter is contributing to the risk?
What should be monitored if the condition continues?
What does the current telemetry suggest about developing problems?

The assistant combines:

Current Telemetry
       +
Prediction State
       +
Phase-2 Risk
       +
Detected Reasons
       ↓
Human-readable Explanation

This allows the operator to query the machine state instead of manually interpreting every telemetry value.

Digital Twin

The frontend includes an interactive 3D representation of the monitored equipment.

The digital twin is implemented using:

React
Three.js
React Three Fiber
Drei

The interface represents the machine environment and provides a visual layer for telemetry and machine-state information.

The interface also supports:

Interactive 3D visualization
Sensor visibility controls
Grid controls
Dark / light theme
Machine telemetry
Risk indicators
Alerts
Predictions
Reports
Backend

The backend is implemented using FastAPI.

Main responsibilities
Receive and process telemetry
Maintain machine context
Generate machine-state information
Run Phase-2 anomaly analysis
Provide prediction information
Feed the AI assistant
Provide WebSocket-based telemetry communication
Backend stack
Python
FastAPI
WebSockets
NumPy
Joblib support for optional model artifacts
Frontend

The frontend provides the operator dashboard.

Frontend stack
React 19
Vite
Tailwind CSS
Three.js
React Three Fiber
Drei

The dashboard provides a unified interface for:

Live telemetry
Machine status
Digital twin
Risk
Alerts
Predictions
Reports
AI Assistant
Settings
Real-Time Data Flow

The current hardware-to-software flow is:

Physical Sensors
      ↓
Raspberry Pi 4B
      ↓
Real Hardware Telemetry
      ↓
Network Communication
      ↓
FastAPI Backend
      ↓
Telemetry Processing
      ↓
Phase-2 Anomaly Analysis
      ↓
Machine Context
      ↓
AI Assistant
      ↓
React Dashboard

This allows physical hardware measurements to influence the software dashboard and anomaly-analysis pipeline in real time.

Technology Stack
Layer	Technology
Edge Controller	Raspberry Pi 4B
Temperature	DHT11
Pressure	BMP280
Vibration	Accelerometer
Motor	28BYJ-48 Stepper
Backend	Python + FastAPI
Communication	WebSocket / HTTP
Anomaly Analysis	Adaptive Statistical Baseline
Optional ML	Joblib / Isolation Forest support
Frontend	React
Styling	Tailwind CSS
3D Visualization	Three.js
3D Framework	React Three Fiber + Drei
Project Structure
NanoPredict/
│
├── backend/
│   ├── ai/
│   │   ├── assistant.py
│   │   └── context.py
│   │
│   ├── phase2_predictor.py
│   ├── telemetry.py
│   ├── hardware.py
│   ├── websocket.py
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── nanopredict.py
└── README.md
Running the Backend

Create/activate the Python environment:

cd ~/NanoPredict
source venv/bin/activate

Start the FastAPI backend:

uvicorn backend.main:app --host 0.0.0.0 --port 8000
Hardware Telemetry

On the Raspberry Pi, the real hardware telemetry program reads the connected sensors and motor state.

Example:

python3 ~/send_real_hardware.py

The Raspberry Pi then sends real telemetry to the NanoPredict backend.

Verification

The backend modules can be checked using:

python3 -m py_compile \
backend/phase2_predictor.py \
backend/telemetry.py \
backend/ai/context.py \
backend/ai/assistant.py
Key Demonstration

A complete NanoPredict demonstration follows this sequence:

1. Start Raspberry Pi
        ↓
2. Read physical sensors
        ↓
3. Send real telemetry
        ↓
4. Backend receives telemetry
        ↓
5. Phase-2 analyzes sensor behavior
        ↓
6. Risk / anomaly state generated
        ↓
7. Machine context updated
        ↓
8. AI Assistant explains the state
        ↓
9. Dashboard and Digital Twin update

Example operator query:

"Based on the latest Raspberry Pi telemetry, is there any indication of abnormal machine behavior, and what should I monitor?"

Current Prototype Status
Implemented
 Raspberry Pi hardware integration
 Real sensor telemetry
 Motor telemetry
 Backend telemetry processing
 WebSocket communication
 Phase-2 anomaly analysis
 Adaptive telemetry baseline
 Risk classification
 AI Assistant integration
 React dashboard
 Interactive 3D Digital Twin
 Alerts
 Predictions
 Reports
 Real hardware-to-software telemetry flow
Future Development
 Dedicated vacuum sensor integration
 Larger real-world telemetry dataset
 Train and validate a dedicated anomaly-detection model
 Improved drift estimation and calibration
 Hardware vibration characterization
 Long-term predictive maintenance modeling
 Deployment on a dedicated edge/cloud architecture
Team

Team Lead: Sharan K U

Team Members:

M S Sitaansh
Kriday Rastogi
Shubham Vishal Injatkar
Project

NanoPredict

Autonomous Sub-Nanometer Drift & Vacuum Anomaly Prediction in Lithography Equipment

Developed as a hardware and embedded systems prototype for NIRMAAN 2026

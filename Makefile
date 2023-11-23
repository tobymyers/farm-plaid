# Makefile

.PHONY: setup run

setup:
	pip install -r requirements.txt
	source venv/bin/activate && pip install -r requirements.txt

run:
	source venv/bin/activate && python3 app.py

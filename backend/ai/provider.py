from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict


class AIProvider(ABC):
    """
    Interface for an AI response provider.

    The provider receives already-grounded NanoPredict context.
    It must not generate or invent machine telemetry.
    """

    @abstractmethod
    async def generate(
        self,
        question: str,
        context: Dict[str, Any],
    ) -> str:
        raise NotImplementedError


class RuleBasedProvider(AIProvider):
    """
    Safe local provider.

    The actual engineering response logic will be implemented in
    assistant.py. This provider exists so the AI layer can operate
    without an external API.
    """

    async def generate(
        self,
        question: str,
        context: Dict[str, Any],
    ) -> str:
        return (
            "The local NanoPredict AI provider is active. "
            "Use the grounded assistant response generator for "
            "machine-specific analysis."
        )


class UnavailableProvider(AIProvider):
    """
    Explicit provider used when an external AI provider has not been
    configured.

    This prevents the application from silently pretending that an
    external AI service is available.
    """

    def __init__(self, reason: str) -> None:
        self.reason = reason

    async def generate(
        self,
        question: str,
        context: Dict[str, Any],
    ) -> str:
        raise RuntimeError(self.reason)


def get_default_provider() -> AIProvider:
    """
    Return the currently configured provider.

    For the first implementation, NanoPredict deliberately defaults
    to the local rule-based provider. External LLM integration can be
    enabled later through an explicit configuration.
    """

    return RuleBasedProvider()

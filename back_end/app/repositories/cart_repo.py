"""Carrinho em memória com suporte a adição, atualização de quantidade e remoção.

Em produção, trocar por Redis. A interface (add, update, remove, get, clear, total)
permanece idêntica.
"""
import threading
import uuid
from typing import Any, Dict, List


class CartRepository:
    def __init__(self):
        self._carts: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()

    def _ensure_cart(self, session_id: str) -> Dict[str, Any]:
        if session_id not in self._carts:
            self._carts[session_id] = {"itens": [], "pedido_id": None}
        return self._carts[session_id]

    # ----------------------------------------------------------
    def add_item(
        self,
        session_id: str,
        product_id: str,
        nome: str,
        preco: float,
        quantidade: int = 1,
    ) -> Dict[str, Any]:
        with self._lock:
            cart = self._ensure_cart(session_id)
            pid = str(product_id)
            for item in cart["itens"]:
                if str(item["product_id"]) == pid:
                    item["quantidade"] += int(quantidade)
                    return self._snapshot(session_id)
            cart["itens"].append({
                "product_id": pid,
                "nome": nome,
                "preco": float(preco),
                "quantidade": int(quantidade),
            })
            return self._snapshot(session_id)

    # ----------------------------------------------------------
    def update_quantity(
        self,
        session_id: str,
        product_id: str,
        quantidade: int,
    ) -> Dict[str, Any]:
        """Atualiza quantidade de um item no carrinho. Se quantidade <= 0, remove o item."""
        with self._lock:
            cart = self._ensure_cart(session_id)
            pid = str(product_id)

            item_found = None
            for item in cart["itens"]:
                if str(item["product_id"]) == pid:
                    item_found = item
                    break

            if not item_found:
                raise ValueError(f"Produto {product_id} não encontrado no carrinho")

            if quantidade <= 0:
                cart["itens"] = [i for i in cart["itens"] if str(i["product_id"]) != pid]
            else:
                item_found["quantidade"] = min(int(quantidade), 99)

            return self._snapshot(session_id)

    # ----------------------------------------------------------
    def remove_item(
        self,
        session_id: str,
        product_id: str,
    ) -> Dict[str, Any]:
        """Remove item do carrinho da sessão."""
        with self._lock:
            cart = self._ensure_cart(session_id)
            pid = str(product_id)
            cart["itens"] = [i for i in cart["itens"] if str(i["product_id"]) != pid]
            return self._snapshot(session_id)

    # ----------------------------------------------------------
    def get(self, session_id: str) -> Dict[str, Any]:
        with self._lock:
            return self._snapshot(session_id)

    # ----------------------------------------------------------
    def clear(self, session_id: str):
        with self._lock:
            self._carts[session_id] = {"itens": [], "pedido_id": None}

    # ----------------------------------------------------------
    def checkout(self, session_id: str) -> Dict[str, Any]:
        with self._lock:
            cart = self._snapshot(session_id)
            if not cart["itens"]:
                raise ValueError("Carrinho vazio")
            pedido_id = f"PM-{uuid.uuid4().hex[:8].upper()}"
            self._carts[session_id]["pedido_id"] = pedido_id
            itens = [dict(i) for i in cart["itens"]]
            self._carts[session_id]["itens"] = []
            return {
                "pedido_id": pedido_id,
                "total": cart["total"],
                "status": "simulado_aprovado",
                "itens": itens,
            }

    # ----------------------------------------------------------
    def _snapshot(self, session_id: str) -> Dict[str, Any]:
        cart = self._ensure_cart(session_id)
        total = sum(i["preco"] * i["quantidade"] for i in cart["itens"])
        return {
            "session_id": session_id,
            "itens": [dict(i) for i in cart["itens"]],
            "total": round(total, 2),
            "pedido_id": cart.get("pedido_id"),
        }

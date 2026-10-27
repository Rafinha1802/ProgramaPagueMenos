"""Repositório de Pedidos e Histórico de Compras Seguro e Coerente.

Persiste pedidos realizados no checkout em data/orders.json para que o cliente
possa acompanhar seu histórico real no UserProfilePage, com isolamento estrito
de dados entre usuários e sessões.
"""
import json
import logging
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# Pedidos modelo padrão pertencentes exclusivamente ao perfil semente user_1
INITIAL_ORDERS: List[Dict[str, Any]] = [
    {
        "id": "FV-98421",
        "session_id": "sess_default",
        "user_id": "user_1",
        "date": "18/10/2026",
        "time": "15:42",
        "status": "Entregue",
        "statusColor": "#059669",
        "statusBg": "#DCFCE7",
        "deliveryType": "Entrega Turbo Express (45 min)",
        "paymentMethod": "Pix à Vista",
        "address": "Av. Paulista, 1578, Apto 82 - Bela Vista, São Paulo - SP",
        "total": 98.96,
        "discount": 15.00,
        "subtotal": 113.96,
        "freight": 0.00,
        "items": [
            {
                "id": "57259",
                "name": "Protetor Solar Nivea Sun Protect & Toque Seco FPS50 Spray 200ml",
                "brand": "NIVEA",
                "quantity": 1,
                "price": 97.99,
                "image": "/products/nivea-sun-fps50.jpg",
            },
            {
                "id": "18537",
                "name": "Dipirona Monoidratada 500mg 10 Comprimidos Genérico EMS",
                "brand": "EMS GENÉRICO",
                "quantity": 2,
                "price": 3.49,
                "image": "/products/dipirona-ems.jpg",
            },
            {
                "id": "46533",
                "name": "Solução Fisiológica Dauf Pro Soro 0,9% 500ml",
                "brand": "DAUF",
                "quantity": 1,
                "price": 8.99,
                "image": "/products/soro-dauf.jpg",
            },
        ],
    },
    {
        "id": "FV-84192",
        "session_id": "sess_default",
        "user_id": "user_1",
        "date": "02/10/2026",
        "time": "11:20",
        "status": "Entregue",
        "statusColor": "#059669",
        "statusBg": "#DCFCE7",
        "deliveryType": "Retirada Express em Loja (Loja Jardins)",
        "paymentMethod": "Cartão de Crédito Mastercard (2x)",
        "address": "Retirado na Loja Pague Menos - Rua Augusta, 1420",
        "total": 14.99,
        "discount": 0.00,
        "subtotal": 14.99,
        "freight": 0.00,
        "items": [
            {
                "id": "183582",
                "name": "Gel Desodorante Antitranspirante Clinical Strength Secret 45g",
                "brand": "SECRET",
                "quantity": 1,
                "price": 14.99,
                "image": "/products/secret-clinical.jpg",
            }
        ],
    },
]


class OrderRepository:
    def __init__(self, data_file: str = "data/orders.json"):
        self.path = Path(data_file)
        self._lock = threading.Lock()
        self._init_storage()

    def _init_storage(self):
        with self._lock:
            try:
                self.path.parent.mkdir(parents=True, exist_ok=True)
                if not self.path.exists():
                    self._save_orders_unlocked(INITIAL_ORDERS)
                    logger.info(f"Base de pedidos inicializada em {self.path}")
            except Exception as e:
                logger.warning(f"Aviso ao inicializar storage de pedidos: {e}")

    def _load_orders_unlocked(self) -> List[Dict[str, Any]]:
        try:
            if not self.path.exists():
                return [dict(o) for o in INITIAL_ORDERS]
            with open(self.path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if not content:
                    return [dict(o) for o in INITIAL_ORDERS]
                return json.loads(content)
        except Exception as e:
            logger.error(f"Erro ao ler pedidos de {self.path}: {e}")
            return [dict(o) for o in INITIAL_ORDERS]

    def _load_orders(self) -> List[Dict[str, Any]]:
        with self._lock:
            return self._load_orders_unlocked()

    def _save_orders_unlocked(self, orders: List[Dict[str, Any]]) -> None:
        try:
            with open(self.path, "w", encoding="utf-8") as f:
                json.dump(orders, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Erro ao salvar pedidos em {self.path}: {e}")

    def _save_orders(self, orders: List[Dict[str, Any]]) -> None:
        with self._lock:
            self._save_orders_unlocked(orders)

    # ----------------------------------------------------------
    def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            orders = self._load_orders_unlocked()
            orders.insert(0, order_data)
            self._save_orders_unlocked(orders)
            return order_data

    # ----------------------------------------------------------
    def list_orders(
        self,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Lista pedidos com isolamento absoluto entre usuários e sessões."""
        with self._lock:
            orders = self._load_orders_unlocked()

            # Proteção: sem filtro, não expõe pedidos de nenhum usuário
            if not user_id and not session_id:
                return []

            results = []
            for o in orders:
                if user_id:
                    # Se buscando por usuário autenticado, traz apenas pedidos do seu ID
                    if o.get("user_id") == user_id:
                        results.append(o)
                elif session_id:
                    # Se buscando por sessão anônima, traz apenas pedidos daquela sessão sem usuário atrelado
                    if o.get("session_id") == session_id and not o.get("user_id"):
                        results.append(o)

            return results

    # ----------------------------------------------------------
    def get_by_id(
        self,
        order_id: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        with self._lock:
            orders = self._load_orders_unlocked()
            for o in orders:
                if o["id"] == order_id:
                    # Se o pedido pertence a um usuário cadastrado, exige autenticação com o mesmo user_id
                    if o.get("user_id"):
                        if not user_id or o.get("user_id") != user_id:
                            return None
                    else:
                        # Se o pedido for anônimo, exige correspondência da session_id
                        if not session_id or o.get("session_id") != session_id:
                            return None
                    return dict(o)
            return None
